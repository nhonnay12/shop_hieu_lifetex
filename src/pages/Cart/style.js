import { Checkbox, InputNumber, Form, Input } from 'antd';
import styled from 'styled-components';

export const CustomCheckbox = styled(Checkbox)`
    .ant-checkbox-inner {
        width: 25px;
        height: 25px;
    }
    .ant-checkbox-inner::after {
        width: 10.714286px;
        height: 17.142857px;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #c92127;
        border-color: #c92127;
    }
    .ant-checkbox:hover .ant-checkbox-inner {
        border: #c92127;
    }
    .ant-checkbox:hover {
        background-color: #c92127;
        border-color: #c92127;
    }
    .ant-checkbox-inner:hover {
        background-color: #c92127;
        border: #c92127;
    }
    .ant-checkbox-wrapper::after {
        background-color: #c92127;
        border: #c92127;
    }
    .ant-checkbox::after {
        background-color: #c92127;
        border: #c92127;
    }
`;

export const WrapperInputNumber = styled(InputNumber)`
    .ant-input-number-handler-wrap {
        display: none !important;
    }
    input.ant-input-number-input {
        padding: 0 !important;
        text-align: center;
        font-size: 18px;
    }
    .ant-input-number:focus {
        outline: none;
        border-color: transparent;
        border-inline-end-width: none;
    }
`;

export const WrapperForm = styled(Form)`
    margin-top: 20px;
    .ant-form-item-required:before {
        display: none !important;
    }
    .ant-col.ant-col-3.ant-form-item-label {
        text-align: start;
    }
`;

export const WrapperInput = styled(Input)`
    .ant-input {
        color: #333 !important;
    }
`;
