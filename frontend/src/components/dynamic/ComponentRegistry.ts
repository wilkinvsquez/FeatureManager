import { type Component } from "vue";
import Button from "./Button.vue";
import Container from "./Container.vue";
import Heading from "./Heading.vue";
import Text from "./Text.vue";
import Card from "./Card.vue";
import Collapsible from "./Collapsible.vue";
import Toggle from "./Toggle.vue";
import Dropdown from "./Dropdown.vue";
import Checkbox from "./Checkbox.vue";
import TextInput from "./TextInput.vue";
import DatePicker from "./DatePicker.vue";

export const ComponentRegistry: Record<string, Component> = {
    // Basic Components
    button: Button,
    container: Container,
    heading: Heading,
    text: Text,

    // Structural Components
    card: Card,
    collapsible: Collapsible,
    containerCollapsible: Collapsible,

    // Form Components
    toggle: Toggle,
    dropdown: Dropdown,
    dropdownDatePicker: Dropdown,
    checkbox: Checkbox,
    radioGroup: Dropdown,
    input: TextInput,
    date: DatePicker,
};
export const getComponent = (type: string): Component | null => {
    return ComponentRegistry[type] || null;
};