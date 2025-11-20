import { Steps } from 'antd';

function StepComponet({ current = 0, items = [] }) {
    return (
        <Steps current={current}>
            {items.map((item) => {
                return <Steps key={item.title} title={item.title} description={item.description} />;
            })}
        </Steps>
    );
}

export default StepComponet;
