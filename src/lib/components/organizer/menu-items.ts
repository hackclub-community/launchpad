import {
	type IconProps,
	HouseIcon,
	InfoIcon,
	UserLockIcon,
	SendIcon,
	UsersIcon,
	GalleryVerticalEndIcon
} from '@lucide/svelte';
import type { Component } from 'svelte';

export const menuItems: {
	title?: string;
	items: {
		title: string;
		href?: string;
		onClick?: () => void;
		icon?: Component<IconProps>;
	}[];
}[] = [
	{
		items: [
			{
				title: 'Home',
				href: '/organizer',
				icon: HouseIcon
			},
			{
				title: 'Teams',
				href: '/organizer/teams',
				icon: UsersIcon
			},
			{
				title: 'Send',
				icon: SendIcon
			},
			{
				title: 'Timeline',
				href: '/organizer/timeline',
				icon: GalleryVerticalEndIcon
			}
		]
	},
	{
		title: 'Management',
		items: [
			{
				title: 'Event Details',
				href: '/organizer/details',
				icon: InfoIcon
			},
			{
				title: 'Organizers',
				href: '/organizer/organizers',
				icon: UserLockIcon
			}
		]
	}
];
