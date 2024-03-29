export type UserTestDTO = {
    user_id?: number;
    test_id?: number;
    user_quiz_id?: number;
    option_id?: number;
    answer?: string;
    score?: number;
    media_id?: number;
}


export type SaveUserTestDTO = {
    test_id: number;
    option_id: number;
    answer: string;
    media_id: number;
}