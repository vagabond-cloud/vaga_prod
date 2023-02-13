import Link from 'next/link';

const Item = ({ data, isLoading }) => {

  return isLoading ? (
    <div className="h-6 mb-3 bg-gray-600 rounded animate-pulse" />
  ) : (
    <li>
      <Link href={data.path} className="text-gray-300 hover:text-white text-sm flex gap-2 my-4">
        <data.icon className="w-5 h-5" />{data.name}
      </Link>
    </li>
  );
};

Item.defaultProps = {
  data: null,
  isLoading: false,
};

export default Item;
