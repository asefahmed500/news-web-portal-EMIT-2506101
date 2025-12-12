
export type User = {
	id: number | string;
	name: string;
	email?: string;
};

export type Comment = {
	id: number | string;
	text: string;
	user_id: number | string;
	timestamp?: string;
};

export type NewsItem = {
	id: number | string;
	title: string;
	body: string;
	author_id: number | string;
	comments: Comment[];
};
