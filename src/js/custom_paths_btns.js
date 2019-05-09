export const create_paths_arr = paths_string => {
    const paths = paths_string.split(',');
    const paths_final = paths.length === 1 && paths[0] === ''
        ? []
        : paths;

    return paths_final;
};
