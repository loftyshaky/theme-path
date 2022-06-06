import React from 'react';
import { toJS, makeObservable, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Store from 'electron-store';

const store = new Store();

export class Tr extends React.Component {
    constructor(props) {
        super(props);

        this.display_style = {}; // observable

        makeObservable(this, {
            display_style: observable,

            handle_transition: action,
        });

        ({ name: this.name, tr_end_callbacks: this.tr_end_callbacks } = this.props);

        // eslint-disable-next-line react/no-unused-class-component-methods
        this.normal_duration = 200;
        // eslint-disable-next-line react/no-unused-class-component-methods
        this.theme = store.get('theme');

        this.create_transitions();
        this.handle_transition(false);
    }

    componentDidUpdate() {
        this.handle_transition(true);
    }

    create_transitions = () => {
        try {
            this.transitions = {
                gen: this.create_tran('opacity_0', 'opacity_1'), // general
                upload_box: this.create_tran(
                    'upload_box_background_unactive',
                    'upload_box_background_active',
                ),
                fieldset: this.create_tran(
                    'fieldset_border_color_unactive',
                    'fieldset_border_color_active',
                ),
                legend: this.create_tran('legend_color_unactive', 'legend_color_active'),
            };
        } catch (er) {
            err(er, 115);
        }
    };

    //> choose component mode (shown or hidden)
    transit = (name, state) => {
        try {
            return state ? this.transitions[name].active : this.transitions[name].unactive;
        } catch (er) {
            err(er, 116);
        }

        return undefined;
    };
    //< choose component mode (shown or hidden)

    //> hide component when it faded out or show component when it starting fading in
    handle_transition = (called_from_component_did_update, tr_end_callbacks) => {
        try {
            const { state } = this.props;
            const component_uses_fading_transition = this.name === 'gen';

            if (component_uses_fading_transition) {
                const component_is_visible = this.display_style.visibility;

                if (!called_from_component_did_update && !state) {
                    if (!state) {
                        this.display_style = {
                            position: 'fixed',
                            visibility: 'hidden',
                            top: '-99999px',
                        };
                    }
                } else if (state) {
                    if (component_is_visible) {
                        this.display_style = {};
                    }
                }
            }

            if (tr_end_callbacks && !state) {
                tr_end_callbacks.forEach((f) => f());
            }
        } catch (er) {
            err(er, 117);
        }
    };
    //< hide component when it faded out or show component when it starting fading in

    //> create other transitions
    create_tran = (unactive, active) => {
        // def = default
        try {
            const tran = {
                unactive,
                active,
            };

            return tran;
        } catch (er) {
            err(er, 119);
        }

        return undefined;
    };
    //< create other transitions

    render() {
        const { attr, state, children } = this.props;
        const class_name = `${attr.className} ${this.transit(this.name, state)}`;
        const display_style = toJS(this.display_style);

        return (
            <this.props.tag
                {...attr}
                className={class_name}
                ref={this.tr}
                style={display_style}
                onTransitionEnd={this.handle_transition.bind(null, false, this.tr_end_callbacks)}
            >
                {children}
            </this.props.tag>
        );
    }
}

observer(Tr);
