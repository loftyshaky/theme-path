import React from 'react';
import {
    decorate,
    observable,
    action,
    configure,
} from 'mobx';
import { observer } from 'mobx-react';
import * as r from 'ramda';
import Store from 'electron-store';

import * as settings from 'js/settings';

const store = new Store();
configure({ enforceActions: 'observed' });

//--

export class Tr extends React.Component {
    constructor(props) {
        super(props);

        this.normal_duration = 200;
        this.theme = store.get('theme');

        this.create_transitions();

        //> observables
        this.display_style = {};
        //< observables
    }

    componentWillMount() {
        this.hide_component(false);
    }

    componentWillUpdate() {
        try {
            if (this.theme !== settings.ob.theme) {
                this.theme = settings.ob.theme;

                this.create_transitions();
            }

        } catch (er) {
            err(er, 114);
        }
    }

    componentDidUpdate() {
        this.hide_component(true);
    }

    create_transitions = () => {
        try {
            const { upload_box, fieldset, legend } = settings.ob.theme_vals[settings.ob.theme];

            this.transitions = {
                gen: this.create_fade(this.normal_duration), // general
                // loading_screen: this.create_fade(400),
                upload_box: this.create_tran(this.normal_duration, 'backgroundColor', '', upload_box),
                fieldset: this.create_tran(this.normal_duration, 'borderColor', '', fieldset),
                legend: this.create_tran(this.normal_duration, 'color', '', legend),
            };


        } catch (er) {
            err(er, 115);
        }
    }

    //> choose component mode (shown or hidden)
    transit = (name, state) => {
        try {
            return state ? this.transitions[name].active : this.transitions[name].def;

        } catch (er) {
            err(er, 116);
        }

        return undefined;
    };
    //< choose component mode (shown or hidden)

    //> hide component when it faded out or show component when it starting fading in
    hide_component = (called_from_component_did_update, tr_end_callbacks) => {
        try {
            const { state: component_is_active, name } = this.props;
            const component_is_visible = this.display_style.visibility;
            const component_uses_fading_transition = 'opacity' in this.transitions[name].active;

            if (!called_from_component_did_update && !component_is_active && component_uses_fading_transition) {
                if (!component_is_active) {
                    this.display_style = {
                        position: 'fixed',
                        visibility: 'hidden',
                    };
                }

            } else if (component_is_active) {
                if (component_is_visible) {
                    this.display_style = {};
                }
            }

            if (tr_end_callbacks && !component_is_active) {
                tr_end_callbacks.forEach(f => f());
            }

        } catch (er) {
            err(er, 117);
        }
    }
    //< hide component when it faded out or show component when it starting fading in

    //> create fade transitions
    create_fade = (duration, opacity) => {
        try {
            const fade = {
                def: {
                    opacity: 0,
                    transition: `opacity ${duration}ms ease-out`,
                },
                active: {
                    opacity: opacity || 1,
                    transition: `opacity ${duration}ms ease-out`,
                },
            };

            return fade;


        } catch (er) {
            err(er, 118);
        }

        return undefined;
    };
    //< create fade transitions

    //> create other transitions
    create_tran = (duration, type, def, active) => {
        try {
            const tran = {
                def: {
                    [type]: def,
                    transition: `${this.camel_case_to_dash(type)} ${duration}ms ease-out`,
                },

                active: {
                    [type]: active,
                    transition: `${this.camel_case_to_dash(type)} ${duration}ms ease-out`,
                },
            };

            return tran;

        } catch (er) {
            err(er, 119);
        }

        return undefined;
    };
    //< create other transitions

    camel_case_to_dash = str => {
        try {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        } catch (er) {
            err(er, 120);
        }

        return undefined;
    };

    render() {
        const {
            attr,
            name,
            state,
            tr_end_callbacks,
            children,
        } = this.props;

        return (
            <this.props.tag
                {...attr}
                ref={this.tr}
                style={r.merge(this.transit(name, state), this.display_style)}
                onTransitionEnd={this.hide_component.bind(null, false, tr_end_callbacks)}
            >
                {children}
            </this.props.tag>
        );
    }
}

decorate(Tr, {
    display_style: observable,

    hide_component: action,
});

observer(Tr);
