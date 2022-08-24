export interface User {
	id: string;    // uuid 또는 nanoid를 사용합니다.
	username: string;
	encryptedPassword: string;    // 비밀번호는 암호화 되어 있어야 합니다.
	posts: Post[];
}

export interface Post {
	id: number;
	title: string;
	content: string;
	author: User;
	comments: Comment[];
	tags: Tag[];
}

export interface Comment {    // 댓글은 포스트에 달 수도 있고, 다른 댓글에도 달 수 있습니다.
	id: number;
	author: User;
	post?: Post;  // 댓글이 포스트에 달렸을 경우, 댓글이 달린 포스트
  comment?: Comment;  // 댓글이 댓글에 달렸을 경우, 댓글이 달린 댓글
	content: string;
	comments?: Comment[];  // 이 댓글에 달려 있는 댓글들
}

export interface Tag {
  id: number;
	name: string;
	posts: Post[];
}

export interface Response {
	success: boolean;  // 요청 성공 여부
	data: any;         // 응답 데이터
	code: string;      // 에러 코드
	message: string;   // 에러 메시지
}