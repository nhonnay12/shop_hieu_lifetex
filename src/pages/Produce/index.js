import { useParams } from 'react-router-dom';
import ProductDetail from '~/components/ProductDetail';

function Produce() {
    const { id } = useParams();
    return (
        <div>
            <ProductDetail idProduct={id} />
        </div>
    );
}

export default Produce;
