import React from 'react';

import x from 'x';

export class HelpItem extends React.Component {
    li = React.createRef();

    componentDidMount() {
        const { name } = this.props;

        this.li.current.innerHTML = x
            .msg(`${name}_li_text`)
            // eslint-disable-next-line import/no-dynamic-require, global-require
            .replace(/(?<=%@)(.*?)(?=@%)/g, (svg_name) => require(`svg/${svg_name}.svg`))
            .replace(/%@|@%/g, '');
    }

    render() {
        const { important } = this.props;

        return <li className={important ? 'important' : null} ref={this.li} />;
    }
}
