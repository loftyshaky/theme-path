import x from 'x';

const { ipcRenderer, remote } = require('electron');

ipcRenderer.on('close_app', () => {
    const choice = remote.dialog.showMessageBox(remote.getCurrentWindow(),
        {
            type: 'question',
            title: x.msg('confirm_title'),
            message: x.msg('app_close_confirm_msg'),
            buttons: [x.msg('app_close_confirm_answer_quit'), x.msg('confirm_answer_cancel')],
        });

    if (choice === 0) {
        ipcRenderer.send('set_let_app_close_var_to_true_and_close_app');

    } else {
        ipcRenderer.send('set_let_app_close_var_to_false');
    }
});
