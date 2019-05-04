import { existsSync, outputFileSync, writeJsonSync, readFileSync } from 'fs-extra';

export const create_json_file = messages_path => {
    try {
        const messages_file_exist = existsSync(messages_path);

        if (!messages_file_exist) {
            outputFileSync(messages_path, '{}', 'utf8');
        }

    } catch (er) {
        err(er, 26);
    }
};

export const parse_json = file_path => {
    try {
        return JSON.parse(readFileSync(file_path, 'utf-8').trim());

    } catch (er) {
        err(er, 57, null, true);
    }

    return undefined;
};

export const write_to_json = (json, json_path) => {
    try {
        writeJsonSync(json_path, json, { spaces: 4 });

    } catch (er) {
        err(er, 65, null, false, false, true);
    }
};
