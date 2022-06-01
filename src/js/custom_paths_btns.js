export const create_paths_arr = (paths_string) => {
    try {
        const paths = paths_string.split(',');
        const paths_2 = paths.length === 1 && paths[0] === '' ? [] : paths;

        const paths_final = paths_2.map((path) => path.trim());

        return paths_final;
    } catch (er) {
        err(er, 198);
    }

    return undefined;
};
