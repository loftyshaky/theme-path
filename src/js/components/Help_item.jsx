import React from 'react';

import x from 'x';

export class Help_item extends React.Component {
    li = React.createRef();

    componentDidMount() {
        const { name } = this.props;

        // eslint-disable-next-line global-require, import/no-dynamic-require
        this.li.current.innerHTML = x.msg(`${name}_li_text`).replace(/(?<=%@)(.*?)(?=@%)/g, svg_name => require(`svg/${svg_name}.svg`)).replace(/%@|@%/g, '');
    }

    render() {
        const { important } = this.props;

        return (
            <li
                className={important ? 'important' : null}
                ref={this.li}
            />
        );
    }
}
