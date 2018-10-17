'use strict';

import react from 'react';
import { decorate, observable, action, configure } from "mobx";
import { observer } from "mobx-react";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

export class Tr extends react.Component {
    constructor(props) {
        super(props);

        this.normal_duration = 200;
        this.transitions = {
            gen: this.create_fade(this.normal_duration), // general
            // loading_screen: this.create_fade(400),
            upload_box: this.create_tran(this.normal_duration, 'backgroundColor', '#5d7daf', '#3b6ab5')
        };

        //> observables
        this.display_style = {};
        //< observables
    }

    componentWillMount() {
        this.hide_component(false);
    }

    componentDidUpdate() {
        this.hide_component(true);
    }

    //> choose component mode (shown or hidden)
    transit = (name, state) => {
        return state ? this.transitions[name]['active'] : this.transitions[name]['def']
    };
    //< choose component mode (shown or hidden)

    //> hide component when it faded out or show component when it starting fading in
    hide_component = (called_from_component_did_update, tr_end_callbacks) => {
        const component_is_active = this.props.state;
        const component_is_visible = this.display_style.visibility;
        const component_uses_fading_transition = 'opacity' in this.transitions[this.props.name]['active'];

        if (!called_from_component_did_update && !component_is_active && component_uses_fading_transition) {
            if (!component_is_active) {
                this.display_style = {
                    position: 'fixed',
                    visibility: 'hidden'
                };
            }

        } else if (this.props.state) {
            if (component_is_visible) {
                this.display_style = {};
            }
        }

        if (tr_end_callbacks && !component_is_active) {
            tr_end_callbacks.forEach((f) => f(e));
        }
    }
    //< hide component when it faded out or show component when it starting fading in

    //> create fade transitions
    create_fade = (duration, opacity) => {
        const fade = {
            def: {
                opacity: 0,
                transition: 'opacity ' + duration + 'ms ease-out'
            },
            active: {
                opacity: opacity || 1,
                transition: 'opacity ' + duration + 'ms ease-out'
            }
        };

        return fade;
    };
    //< create fade transitions

    //> create other transitions
    create_tran = (duration, type, def, active) => {
        const tran = {
            def: {
                [type]: def,
                transition: this.camel_case_to_dash(type) + ' ' + duration + 'ms ease-out'
            },

            active: {
                [type]: active,
                transition: this.camel_case_to_dash(type) + ' ' + duration + 'ms ease-out'
            }
        };

        return tran;
    };
    //< create other transitions

    camel_case_to_dash = str => {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    render() {
        return (
            <this.props.tag
                {...this.props.attr}
                ref={this.tr}
                style={r.merge(this.transit(this.props.name, this.props.state), this.display_style)}
                onTransitionEnd={this.hide_component.bind(null, false, this.props.tr_end_callbacks)}
            >
                {this.props.children}
            </this.props.tag>
        );
    }
}

decorate(Tr, {
    display_style: observable,

    hide_component: action
});

Tr = observer(Tr);