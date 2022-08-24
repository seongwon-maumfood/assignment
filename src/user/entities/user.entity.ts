export interface User {
	id: string;    // uuid 또는 nanoid를 사용합니다.
	username: string;
	encryptedPassword: string;    // 비밀번호는 암호화 되어 있어야 합니다.
	posts: Post[];
}