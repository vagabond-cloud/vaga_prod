import Card from '@/components/Card/index';
import Image from "next/dist/client/image";
import {
    ChevronDownIcon,
    PlusIcon,
    ChatBubbleBottomCenterIcon,
    PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Draggable } from "react-beautiful-dnd";
import { priority } from '@/config/modules/projects'

function CardItem({ data, index }) {

    return (
        <Draggable index={index} draggableId={`${data.id}`}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={` rounded-md p-3 m-2 mt-0 last:mb-0 border ${snapshot.isDragging ? "bg-gray-100" : "bg-gray-50"}`}
                >

                    <label
                        className={`bg-gradient-to-r px-2 py-1 rounded text-white text-[10px]
              ${priority.find((a) => a.id === data.priority === 0)
                                ? "from-blue-600 to-blue-400"
                                : data.priority === 1
                                    ? "from-green-600 to-green-400"
                                    :
                                    data.priority === 2
                                        ? "from-green-600 to-green-400"
                                        : "from-red-600 to-red-400"
                            }
              `}
                    >
                        {priority.find((a) => a.id === data.priority).name.toUpperCase()}
                    </label>
                    <h5 className="text-sm my-3 text-md leading-6">{data.title}</h5>
                    <div className="flex justify-between">
                        <div className="flex space-x-2 items-center">
                            <span className="flex space-x-1 items-center text-[12px]">
                                <ChatBubbleBottomCenterIcon className="w-4 h-4 text-gray-500" />
                                <span>{data?.comments?.length}</span>
                            </span>
                            <span className="flex space-x-1 items-center text-[12px]">
                                <PaperClipIcon className="w-4 h-4 text-gray-500" />
                                <span>{data?.documents?.length}</span>
                            </span>
                        </div>

                        <ul className="flex space-x-3">
                            {data.assignees && data.assignees.map((ass, index) => {

                                return (
                                    <li key={index}>
                                        <Image
                                            src={ass.avt}
                                            width="36"
                                            height="36"
                                            objectFit="cover"
                                            className=" rounded-full "
                                            alt=""
                                        />
                                    </li>
                                );
                            })}
                            <li>
                                <button
                                    className="border border-dashed flex items-center w-6 h-6 border-gray-500 justify-center
                    rounded-full"
                                >
                                    <PlusIcon className="w-4 h-4 text-gray-500" />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

            )}
        </Draggable>
    );
}

export default CardItem;