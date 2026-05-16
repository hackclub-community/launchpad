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
		path?: string;
		onClick?: () => void;
		icon?: Component<IconProps>;
	}[];
}[] = [
	{
		items: [
			{
				title: 'Home',
				path: '',
				icon: HouseIcon
			},
			{
				title: 'Teams',
				path: 'teams',
				icon: UsersIcon
			},
			{
				title: 'Send',
				icon: SendIcon
			},
			{
				title: 'Timeline',
				path: 'timeline',
				icon: GalleryVerticalEndIcon
			}
		]
	},
	{
		title: 'Management',
		items: [
			{
				title: 'Event Details',
				path: 'details',
				icon: InfoIcon
			},
			{
				title: 'Organizers',
				path: 'organizers',
				icon: UserLockIcon
			}
		]
	}
];

export function getHref(eventId: string | undefined, path = '') {
	return `/organizer/${eventId}${path ? `/${path}` : ''}`;
}
