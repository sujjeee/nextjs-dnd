"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useState } from 'react';
import SortableLinks from '@/components/SortableLinks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [items, setItems] = useState([
    { name: "NextJS", id: 1 },
    { name: "ReactJS", id: 2 },
    { name: "Astro", id: 3 },
    { name: "Vue", id: 4 },
  ]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(list => list.id === active.id)
        const newIndex = items.findIndex(list => list.id === over.id)

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDelete(idToDelete: number) {
    console.log("delete hit", idToDelete);

    // Use filter to create a new array without the item to be deleted
    setItems((items) => items.filter((item) => item.id !== idToDelete));
  }
  return (
    <main className='flex justify-center items-center h-screen px-2 mx-auto select-none'>
      <Card className='w-full'>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Frameworks</CardTitle>
          <CardDescription>
            List Popular web development frameworks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map(id => <SortableLinks key={id.id} id={id} onDelete={handleDelete} />)}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

    </main>
  )
}
