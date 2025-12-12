
export type User = {
	id: number;
	name: string;
	email?: string;
};

export type Comment = {
	id: number;
	text: string;
	user_id: number;
	timestamp?: string;
};

export type NewsItem = {
	id: number;
	title: string;
	body: string;
	author_id: number;
	comments: Comment[];
};
