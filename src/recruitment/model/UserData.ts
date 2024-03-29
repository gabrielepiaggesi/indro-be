import { Table } from "../../framework/models/Table";

export class UserData extends Table {
    public user_id: number;
    public job_offer_id: number;
    public exam_id: number;
    public user_data_option_id: number;
    public number_value: number;
    public string_value: string;
    public media_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}