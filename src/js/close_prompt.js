import x from 'x';

const { ipcRenderer, remote } = require('electron');

ipcRenderer.on('close_app', () => {
    const choice = remote.dialog.showMessageBox(remote.getCurrentWindow(),
        {
            type: 'question',
            title: x.msg('app_close_confirm'),
            message: x.msg('app_close_msg'),
            buttons: [x.msg('app_close_answer_1'), x.msg('app_close_answer_2')],
        });

    if (choice === 0) {
        ipcRenderer.send('set_let_app_close_var_to_true_and_close_app');

    } else {
        ipcRenderer.send('set_let_app_close_var_to_false');
    }
});
