import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrgValidate from './OrgValidate';


function Changesseq() {
  const user = OrgValidate()
  const { id } = useParams(); // Access route id from URL
  const [route, setRoute] = useState(null);

  useEffect(() => {
    // Fetch all routes
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/route`)
      .then(response => {
        // Find the route with matching id
        const foundRoute = response.data.find(r => r._id === id);
        if (foundRoute) {
          setRoute(foundRoute);
        } else {
          console.error('Route not found');
        }
      })
      .catch(error => {
        console.error('Error fetching routes:', error);
      });
  }, [id]); // Fetch routes whenever route id changes

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedStops = Array.from(route.stop);
    const [reorderedItem] = reorderedStops.splice(result.source.index, 1);
    reorderedStops.splice(result.destination.index, 0, reorderedItem);

    // Update local state
    const updatedRoute = { ...route, stop: reorderedStops };
    setRoute(updatedRoute);

    // Update backend with new sequence
    const updatedStops = reorderedStops.map((stop, index) => ({
      ...stop,
      sequence: index + 1 // Update sequence based on new order
    }));
    console.log(updatedStops)
// console.log(updatedStops)
    axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-routes/${id}`, { stop: updatedStops })
      .then(response => {
        toast.success('Stop sequence updated successfully');
      })
      .catch(error => {
        toast.error('Error updating stop sequence');
      });
  };

  if (!route) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Sequence</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {route.stop.map((stop, index) => (
                <Draggable key={stop._id} draggableId={stop._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-100 border border-gray-200 rounded-md p-4 transition duration-300 ease-in-out hover:bg-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-semibold">{stop.name}</h3>
                        <p className="text-sm text-gray-600">Sequence: {index + 1}</p>
                      </div>
                      <div {...provided.dragHandleProps}>
                      <svg
                          className="w-6 h-6 text-gray-600 cursor-move"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default Changesseq;
