export const val_is_localized = val => {
    try {
        return val.indexOf('__MSG_') > -1;

    } catch (er) {
        err(er, 60);
    }

    return undefined;
};

export const get_message_name = val => {
    try {
        return val.replace(/__MSG_|__/g, '');

    } catch (er) {
        err(er, 61);
    }

    return undefined;
};

//> varibles t
export const mut = {
    manifest: null,
};
//< varibles t
