import { Form, Input, Radio } from 'antd';
import styled from 'styled-components';
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
export const WrapperRadio = styled(Radio)`
    padding: 10px 0;
    font-weight: 600;
`;

export const BuyWayRadio = styled(Radio)`
    padding: 10px 0;
`;
