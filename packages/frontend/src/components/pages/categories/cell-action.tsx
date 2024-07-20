"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";
import { FormModal } from "./form-modal";
import { Delete } from "@/hooks/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  data: CategoryColumn;
}

const endpoint = "categories";
const name = "Category";

export const CellAction: React.FC<Props> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`${name} Id copied to clipboard.`);
  };

  const deleteQuery = useMutation({
    mutationFn: Delete,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (e: any) => {
      toast.error(`Error deleting ${name.toLowerCase()} ${e}`);
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() =>
          deleteQuery.mutate(`/courses/${data.courseId}/${endpoint}/${data.uuid}`)
        }
        loading={deleteQuery.isPending}
      />

      {editOpen && (
        <FormModal
          isOpen={editOpen}
          entityId={data.uuid}
          courseId={data.courseId}
          courseSlug={data.courseSlug}
          onClose={() => setEditOpen(false)}
          onConfirm={() => setEditOpen(false)}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open options</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Quick Edit
          </DropdownMenuItem>

          <DropdownMenuItem className="py-0">
            <Link
              className="flex items-center w-full h-full py-2"
              href={`/course/${data.courseSlug}/${endpoint}/${data.uuid}`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Full Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onCopy(data.uuid)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
