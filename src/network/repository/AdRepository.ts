import { Repository } from "../../framework/repositories/Repository";
import { Ad } from "../model/Ad";
const db = require("../../connection");

export class AdRepository extends Repository<Ad> {
    public table = "ads";

    public async findAdsForFeed(lastPostId = 0, fromAge = 18, toAge = 65, cat = 1, conn = null, query = null) {
        const c = conn || await db.connection();
        const addPage = (lastPostId != 0) ? ` and ad.id < ${lastPostId} ` : ` `;
        console.log(fromAge, toAge);
        return c.query(query || 
            `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.location as ad_location ,
            ad.feed_date as ad_feed_date,
            ad.created_at as ad_created_at,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram,
            user.email as user_email, 
            (case when (user.whatsapp is not null or user.telegram is not null) then 1 else 0 end) as has_contact,
            (case when (user.image_url is not null) then 1 else 0 end) as has_image 
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.image_url is not null and user.deleted_at is null and user.age between ${fromAge} and ${toAge} 
            where ad.deleted_at is null ${addPage} 
            and ad.category_id = ${cat} 
            order by ad.feed_date desc  
            limit 9`
        ).then((results) => results);
    }

    public async findAd(adId, conn = null, query = null) {
        const c = conn;
        return c.query(query || 
            `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.location as ad_location,
            ad.feed_date as ad_feed_date,
            ad.bio as ad_bio,
            ad.created_at as ad_created_at,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram, 
            user.email as user_email  
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.deleted_at is null  
            where ad.deleted_at is null and ad.id = ${adId} 
            limit 1`
        ).then((results) => results[0]);
    }

    public async findAdsByUserId(userId, lastPostId = 0, conn = null, query = null) {
        const c = conn || await db.connection();
        const addPage = (lastPostId != 0) ? ` and ad.id < ${lastPostId} ` : ` `;
        return c.query(query || 
            `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.location as ad_location,
            ad.feed_date as ad_feed_date,
            ad.created_at as ad_created_at,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram, 
            user.email as user_email  
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.deleted_at is null   
            where ad.deleted_at is null ${addPage} 
            and ad.user_id = ${userId} 
            order by ad.feed_date desc 
            limit 9`
        ).then((results) => results);
    }
}
