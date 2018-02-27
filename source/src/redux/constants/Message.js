import getString from "../../translations";

export const STATUS_PENDING         = 1;
export const STATUS_NOTIFICATION    = 2;
export const STATUS_CLICKED         = 3;
export const STATUS_VIEWED          = 4;

/*
type:
data:
 */

/*
id:
type:
timestamp:
data:
 */
export const TYPE_UNKNOWN           = 0;
/*
data:
    title, description, url,
 */
export const TYPE_SYSTEM            = 1;
export const TYPE_NEWS              = 2;
/*
data:
    hash,from,to,value, extra
 */
export const TYPE_NEWTRANSACTION    = 3;
export const TYPE_CONFIRMTRANSACTION= 4;
export const TYPE_VIEW_MESSAGE      = 5;

export const FROM_REMOTE            = 1;
export const FROM_JPUSH_REMOTE      = 2;
export const FROM_NOTIFICATION      = 3;
export const FROM_LOCAL             = 4;

export const getMessageTypeString = (type) => {
    if (type == TYPE_NEWTRANSACTION) {
        return getString("message_type_newtransaction");
    } else if (type == TYPE_CONFIRMTRANSACTION) {
        return getString("message_type_confirmtransaction");
    } else if (type == TYPE_SYSTEM) {
        return getString("message_type_system");
    } else if (type == TYPE_NEWS) {
        return getString("message_type_news");
    } else {
        return getString("message_type_unknown");
    }
}