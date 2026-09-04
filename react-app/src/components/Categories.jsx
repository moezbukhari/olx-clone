import CategoriesList from './CategoriesList';
import { useNavigate } from 'react-router-dom';
function Categories(props) {
    const categories = CategoriesList;
    const navigate = useNavigate();
    return (
        <div className='cat-container'>
            <span onClick={() => props.handlecategory && props.handlecategory('All categories')} className='category'>All categories</span>
            {categories && categories.length > 0 && categories.map((item, index) => (
                <span onClick={() =>navigate('/category/'+item)} key={index} className='category'>
                    {item}
                </span>
            ))}
        </div>
    );
}

export default Categories;
