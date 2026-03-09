<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import * as Badge from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Input from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';

	import { useSidebar } from '$lib/components/ui/sidebar';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import {
		MonitorIcon,
		SmartphoneIcon,
		TabletSmartphoneIcon,
		TvIcon,
		WatchIcon,
		GlobeIcon,
		RefreshCwIcon
	} from '@lucide/svelte';
	import { UAParser } from 'ua-parser-js';
	import { cn } from '$lib/utils';

	let { open = $bindable() }: { open: boolean } = $props();

	const sidebar = useSidebar();

	let name = $state('');
	let initialName = $state('');
	let email = $state('');
	let loadingProfile = $state(false);
	let savingName = $state(false);
	let sessions = $state<ParsedSession[]>([]);
	let loadingSessions = $state(false);
	let revoking = $state<Record<string, boolean>>({});
	let revokeConfirmOpen = $state(false);
	let pendingSession = $state<ParsedSession | null>(null);
	let currentSessionToken = $state<string | null>(null);
	let accounts = $state<AccountItem[]>([]);
	let loadingAccounts = $state(false);
	let linkingProvider = $state<Record<string, boolean>>({});
	let unlinkingProvider = $state<Record<string, boolean>>({});
	let deleteConfirmOpen = $state(false);
	let deletingAccount = $state(false);
	let loadedOnce = $state(false);
	let mobileTab = $state<'profile' | 'providers' | 'sessions' | 'danger'>('profile');
	let desktopTab = $state<'profile' | 'providers' | 'sessions' | 'danger'>('profile');
	const desktopTabs = [
		{ value: 'profile', label: 'Profile' },
		{ value: 'providers', label: 'Providers' },
		{ value: 'sessions', label: 'Sessions' },
		{ value: 'danger', label: 'Danger zone' }
	] as const;

	type SessionItem = {
		id?: string;
		token?: string;
		createdAt?: number | string | Date;
		updatedAt?: number | string | Date;
		expiresAt?: number | string | Date;
		ipAddress?: string | null;
		userAgent?: string | null;
	};

	type ParsedSession = SessionItem & {
		parsed: {
			browser: string;
			os: string;
			deviceType: string | undefined;
			deviceLabel: string;
		};
	};

	type AccountItem = {
		id: string;
		providerId: string;
		accountId: string;
	};

	const providerConfigs = [
		{ id: 'hca', label: 'Hack Club' },
		{ id: 'github', label: 'GitHub' },
		{ id: 'google', label: 'Google' }
	] as const;

	function parseSession(session: SessionItem): ParsedSession {
		const ua = new UAParser(session.userAgent ?? '');
		const browser = ua.getBrowser();
		const os = ua.getOS();
		const device = ua.getDevice();

		const browserStr = [browser.name, browser.major].filter(Boolean).join(' ');
		const osStr = [os.name, os.version].filter(Boolean).join(' ');

		let deviceLabel = 'Unknown device';
		if (browserStr && osStr) {
			deviceLabel = `${browserStr} on ${osStr}`;
		} else if (browserStr) {
			deviceLabel = browserStr;
		} else if (osStr) {
			deviceLabel = osStr;
		}

		return {
			...session,
			parsed: {
				browser: browserStr,
				os: osStr,
				deviceType: device.type,
				deviceLabel
			}
		};
	}

	async function loadProfile() {
		loadingProfile = true;
		try {
			const { data, error } = await authClient.getSession();
			if (error) throw error;

			name = data?.user?.name ?? '';
			initialName = data?.user?.name ?? '';
			email = data?.user?.email ?? '';
		} catch (err) {
			toast.error('Failed to load account settings');
			console.error(err);
		} finally {
			loadingProfile = false;
		}
	}

	async function loadSessions() {
		loadingSessions = true;
		try {
			const [
				{ data: sessionsData, error: sessionsError },
				{ data: currentSessionData, error: currentSessionError }
			] = await Promise.all([authClient.listSessions(), authClient.getSession()]);

			if (sessionsError) throw sessionsError;
			if (currentSessionError) throw currentSessionError;

			const raw = (sessionsData ?? []) as SessionItem[];
			sessions = raw.map(parseSession);
			currentSessionToken = currentSessionData?.session?.token ?? null;
		} catch (err) {
			toast.error('Failed to load sessions');
			console.error(err);
		} finally {
			loadingSessions = false;
		}
	}

	async function loadAccounts() {
		loadingAccounts = true;
		try {
			const { data, error } = await authClient.listAccounts();
			if (error) throw error;
			accounts = (data ?? []) as AccountItem[];
		} catch (err) {
			toast.error('Failed to load linked providers');
			console.error(err);
		} finally {
			loadingAccounts = false;
		}
	}

	function getLinkedAccount(providerId: string) {
		return accounts.find((account) => account.providerId === providerId);
	}

	async function linkProvider(providerId: string) {
		linkingProvider = { ...linkingProvider, [providerId]: true };
		try {
			const { error } = await authClient.linkSocial({
				provider: providerId,
				callbackURL: '/organizer',
				errorCallbackURL: '/organizer',
				disableRedirect: false
			});
			if (error) throw error;
		} catch (err) {
			toast.error(
				`Failed to link ${providerConfigs.find((p) => p.id === providerId)?.label ?? providerId}`
			);
			console.error(err);
			linkingProvider = { ...linkingProvider, [providerId]: false };
		}
	}

	async function unlinkProvider(providerId: string) {
		const linked = getLinkedAccount(providerId);
		if (!linked) return;

		unlinkingProvider = { ...unlinkingProvider, [providerId]: true };
		try {
			const { error } = await authClient.unlinkAccount({
				providerId,
				accountId: linked.accountId
			});
			if (error) throw error;
			accounts = accounts.filter((account) => account.id !== linked.id);
			toast.success(
				`${providerConfigs.find((p) => p.id === providerId)?.label ?? providerId} unlinked`
			);
		} catch (err) {
			toast.error(
				`Failed to unlink ${providerConfigs.find((p) => p.id === providerId)?.label ?? providerId}`
			);
			console.error(err);
		} finally {
			unlinkingProvider = { ...unlinkingProvider, [providerId]: false };
		}
	}

	function isCurrentSession(session: ParsedSession) {
		return !!session.token && !!currentSessionToken && session.token === currentSessionToken;
	}

	function requestRevokeSession(session: ParsedSession) {
		if (isCurrentSession(session)) return;
		pendingSession = session;
		revokeConfirmOpen = true;
	}

	async function confirmRevokeSession() {
		const session = pendingSession;
		if (!session) return;

		const id = session.id ?? session.token;
		if (!id) {
			revokeConfirmOpen = false;
			pendingSession = null;
			return;
		}

		revoking = { ...revoking, [id]: true };

		if (!session.token) {
			revoking = { ...revoking, [id]: false };
			toast.error('Cannot revoke session without token');
			revokeConfirmOpen = false;
			pendingSession = null;
			return;
		}

		try {
			const { error } = await authClient.revokeSession({ token: session.token });
			if (error) throw error;
			sessions = sessions.filter((s) => (s.id ?? s.token) !== id);
			toast.success('Session revoked');
		} catch (err) {
			toast.error('Failed to revoke session');
			console.error(err);
		} finally {
			revoking = { ...revoking, [id]: false };
			revokeConfirmOpen = false;
			pendingSession = null;
		}
	}

	function formatDate(value: SessionItem['createdAt']) {
		if (!value) return 'Unknown';
		const date =
			value instanceof Date ? value : new Date(typeof value === 'string' ? value : Number(value));
		if (Number.isNaN(date.getTime())) return 'Unknown';
		return new Intl.DateTimeFormat(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getDeviceIcon(deviceType: string | undefined) {
		switch (deviceType) {
			case 'mobile':
				return SmartphoneIcon;
			case 'tablet':
				return TabletSmartphoneIcon;
			case 'smarttv':
				return TvIcon;
			case 'wearable':
				return WatchIcon;
			case 'console':
			case 'embedded':
				return GlobeIcon;
			default:
				return MonitorIcon;
		}
	}

	const canSaveName = $derived.by(() => {
		const trimmed = name.trim();
		return !!trimmed && trimmed !== initialName && !savingName && !loadingProfile;
	});

	async function saveName() {
		const trimmed = name.trim();
		if (!trimmed || trimmed === initialName) return;

		savingName = true;
		try {
			const { error } = await authClient.updateUser({ name: trimmed });
			if (error) throw error;
			name = trimmed;
			initialName = trimmed;
			toast.success('Name updated');
		} catch (err) {
			toast.error('Failed to update name');
			console.error(err);
		} finally {
			savingName = false;
		}
	}

	async function confirmDeleteAccount() {
		deletingAccount = true;
		try {
			const { error } = await authClient.deleteUser();
			if (error) throw error;
			toast.success('Account deleted');
			deleteConfirmOpen = false;
			open = false;
			await goto('/');
		} catch (err) {
			toast.error('Failed to delete account');
			console.error(err);
		} finally {
			deletingAccount = false;
		}
	}

	$effect(() => {
		if (open && !loadedOnce) {
			loadedOnce = true;
			void Promise.all([loadProfile(), loadSessions(), loadAccounts()]);
		}
	});
</script>

{#snippet ProfileSection()}
	<div class="space-y-3">
		<div class="overflow-hidden rounded-sm border bg-card/80 shadow-sm">
			<form
				onsubmit={(event) => {
					event.preventDefault();
					void saveName();
				}}
			>
				<div class="space-y-3 px-4 py-4">
					<h4 class="text-sm font-medium">Name</h4>
					<p class="text-xs text-muted-foreground">
						Please enter your full name, or a display name.
					</p>
					<div class="space-y-2">
						<Label for="account-name" class="sr-only">Name</Label>
						<Input.Root
							id="account-name"
							placeholder="Your name"
							autocomplete="name"
							maxlength={32}
							bind:value={name}
							disabled={loadingProfile || savingName}
						/>
					</div>
				</div>
				<div class="flex items-center justify-between gap-3 border-t px-4 py-3">
					<p class="text-xs text-muted-foreground">Please use 32 characters at maximum.</p>
					<Button.Root type="submit" variant="default" disabled={!canSaveName} class="shrink-0">
						{savingName ? 'Saving…' : 'Save'}
					</Button.Root>
				</div>
			</form>
		</div>

		<div class="overflow-hidden rounded-sm border bg-card/80 shadow-sm">
			<div class="border-b px-4 py-3">
				<h4 class="text-sm font-medium">Email</h4>
				<p class="text-xs text-muted-foreground">Your account sign-in email address.</p>
			</div>
			<div class="p-4">
				<Label for="account-email" class="sr-only">Email</Label>
				<Input.Root
					id="account-email"
					type="email"
					value={email || ''}
					placeholder="No email found"
					disabled
					readonly
				/>
			</div>
		</div>
	</div>
{/snippet}

{#snippet ProvidersSection()}
	<div class="overflow-hidden rounded-sm border bg-card/80 shadow-sm">
		<div class="border-b px-4 py-3">
			<h4 class="text-sm font-medium">Social providers</h4>
			<p class="text-xs text-muted-foreground">Link or unlink sign-in providers.</p>
		</div>
		<div class="space-y-2 p-4">
			{#each providerConfigs as provider (provider.id)}
				{@const linked = getLinkedAccount(provider.id)}
				<div class="flex items-center justify-between rounded-sm border px-3 py-2.5">
					<div class="text-sm font-medium">{provider.label}</div>
					{#if loadingAccounts}
						<Button.Root size="sm" disabled class="min-w-24">Loading...</Button.Root>
					{:else if linked}
						<Button.Root
							variant="outline"
							size="sm"
							disabled={unlinkingProvider[provider.id]}
							onclick={() => void unlinkProvider(provider.id)}
							class="min-w-24"
						>
							{unlinkingProvider[provider.id] ? 'Unlinking…' : 'Unlink'}
						</Button.Root>
					{:else}
						<Button.Root
							size="sm"
							disabled={linkingProvider[provider.id]}
							onclick={() => void linkProvider(provider.id)}
							class="min-w-24"
						>
							{linkingProvider[provider.id] ? 'Redirecting…' : 'Link'}
						</Button.Root>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet SessionsSection()}
	<div class="overflow-hidden rounded-sm border bg-card/80 shadow-sm">
		<div class="flex items-center justify-between border-b px-4 py-3">
			<div class="space-y-1">
				<h4 class="text-sm font-medium">Sessions</h4>
				<p class="text-xs text-muted-foreground">Devices signed in to your account.</p>
			</div>
			<Button.Root
				variant="ghost"
				size="icon"
				class="size-7"
				onclick={() => void loadSessions()}
				disabled={loadingSessions}
			>
				<RefreshCwIcon class="size-3.5 {loadingSessions ? 'animate-spin' : ''}" />
			</Button.Root>
		</div>

		<div class="p-4">
			{#if loadingSessions && sessions.length === 0}
				<div class="py-4 text-center text-sm text-muted-foreground">Loading sessions…</div>
			{:else if sessions.length === 0}
				<div class="py-4 text-center text-sm text-muted-foreground">No sessions found.</div>
			{:else}
				<div class="space-y-1">
					{#each sessions as session ((session.id ?? session.token) || Math.random())}
						{@const isCurrent = isCurrentSession(session)}
						{@const DeviceIcon = getDeviceIcon(session.parsed.deviceType)}
						{@const sessionId = session.id ?? session.token ?? ''}
						<div
							class="group flex items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors {isCurrent
								? 'border-primary/20 bg-primary/5'
								: 'hover:bg-muted/50'}"
						>
							<div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
								<DeviceIcon class="size-4 text-muted-foreground" />
							</div>

							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<span class="truncate text-sm font-medium">
										{session.parsed.deviceLabel}
									</span>
									{#if isCurrent}
										<Badge.Badge variant="secondary" class="shrink-0 px-1.5 py-0 text-[10px]"
											>This device</Badge.Badge
										>
									{/if}
								</div>
								<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span>{session.ipAddress || 'Unknown IP'}</span>
									<span>·</span>
									<span>{formatDate(session.createdAt)}</span>
								</div>
							</div>

							{#if !isCurrent}
								<Button.Root
									variant="destructive"
									size="sm"
									disabled={revoking[sessionId]}
									onclick={() => requestRevokeSession(session)}
								>
									{revoking[sessionId] ? 'Revoking…' : 'Revoke'}
								</Button.Root>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet DangerSection()}
	<div class="overflow-hidden rounded-sm border border-destructive/30 bg-destructive/8 shadow-sm">
		<div class="border-b border-destructive/30 px-4 py-3">
			<h4 class="text-sm font-medium text-destructive">Delete account</h4>
			<p class="text-xs text-muted-foreground">
				Permanently delete your account and all related data.
			</p>
		</div>
		<div class="p-4">
			<Button.Root
				variant="destructive"
				onclick={() => (deleteConfirmOpen = true)}
				class="shrink-0"
			>
				Delete account
			</Button.Root>
		</div>
	</div>
{/snippet}

{#if sidebar.isMobile}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Account</Drawer.Title>
			</Drawer.Header>
			<div class="px-4 pb-4">
				<Tabs.Root bind:value={mobileTab}>
					<Tabs.List class="grid h-auto w-full grid-cols-4">
						<Tabs.Trigger value="profile">Profile</Tabs.Trigger>
						<Tabs.Trigger value="providers">Providers</Tabs.Trigger>
						<Tabs.Trigger value="sessions">Sessions</Tabs.Trigger>
						<Tabs.Trigger value="danger">Danger</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="profile" class="pt-3">
						{@render ProfileSection()}
					</Tabs.Content>
					<Tabs.Content value="providers" class="pt-3">
						{@render ProvidersSection()}
					</Tabs.Content>
					<Tabs.Content value="sessions" class="pt-3">
						{@render SessionsSection()}
					</Tabs.Content>
					<Tabs.Content value="danger" class="pt-3">
						{@render DangerSection()}
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-4xl">
			<Dialog.Header>
				<Dialog.Title>Account</Dialog.Title>
			</Dialog.Header>
			<div class="grid min-h-72 sm:grid-cols-[180px_minmax(0,1fr)]">
				<nav class="space-y-1 pr-4">
					{#each desktopTabs as tab (tab.value)}
						<Button.Root
							variant={desktopTab === tab.value
								? tab.value === 'danger'
									? 'destructive'
									: 'default'
								: 'ghost'}
							class={cn('w-full justify-start', desktopTab !== tab.value && 'border-transparent!')}
							onclick={() => (desktopTab = tab.value)}
						>
							{tab.label}
						</Button.Root>
					{/each}
				</nav>
				<div class="min-w-0">
					{#if desktopTab === 'profile'}
						{@render ProfileSection()}
					{:else if desktopTab === 'providers'}
						{@render ProvidersSection()}
					{:else if desktopTab === 'sessions'}
						{@render SessionsSection()}
					{:else}
						{@render DangerSection()}
					{/if}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<AlertDialog.Root bind:open={deleteConfirmOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete account?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone and will permanently remove your account.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deletingAccount}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => void confirmDeleteAccount()} disabled={deletingAccount}>
				{deletingAccount ? 'Deleting…' : 'Delete account'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={revokeConfirmOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Revoke session?</AlertDialog.Title>
			<AlertDialog.Description>
				This will immediately sign out this session.
				{#if pendingSession}
					{@const DeviceIcon = getDeviceIcon(pendingSession.parsed.deviceType)}
					<span
						class="mt-2 flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-foreground"
					>
						<DeviceIcon class="size-4 shrink-0 text-muted-foreground" />
						<span class="min-w-0">
							<span class="block truncate font-medium">{pendingSession.parsed.deviceLabel}</span>
							<span class="block text-xs text-muted-foreground"
								>{pendingSession.ipAddress || 'Unknown IP'}</span
							>
						</span>
					</span>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => void confirmRevokeSession()}>Revoke</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
