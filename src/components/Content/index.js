import {
  ArrowLeftCircleIcon
} from '@heroicons/react/24/solid'


const Content = ({ children }) => {
  return (
    <div className="flex flex-col min-h-full p-5 space-y-5 overflow-y-auto md:p-10 md:w-3/4">
      {children}
    </div>
  );
};

Content.Container = ({ children }) => {
  return <div className="flex flex-col pb-10 space-y-5">{children}</div>;
};


Content.Divider = ({ thick }) => {
  return thick ? (
    <hr className="border-2 dark:border-gray-600" />
  ) : (
    <hr className="border dark:border-gray-700" />
  );
};

Content.Empty = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-5 bg-gray-100 border-4 border-dashed rounded">
        <p>{children}</p>
      </div>
    </div>
  );
};

Content.Title = ({ subtitle, title }) => {

  const handleBack = () => {
    window.history.back()
  };

  return (
    <div>
      <div className="flex gap-4">
        <ArrowLeftCircleIcon className="w-8 cursor-pointer hover:text-red-600" onClick={handleBack} />
        <h1 className="text-lg font-bold md:text-lg">{title}</h1>
      </div>
      <h3 className="text-gray-400 text-sm ml-12">{subtitle}</h3>
    </div>
  );
};

Content.Container.displayName = 'Container';
Content.Divider.displayName = 'Divider';
Content.Empty.displayName = 'Empty';
Content.Title.displayName = 'Title';

export default Content;
