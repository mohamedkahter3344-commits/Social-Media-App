
import { Pencil } from "@gravity-ui/icons";
import { Dropdown, Label } from "@heroui/react";

type UpdateCommentProps = {
  onEdit: () => void;
};

const UpdateComment = ({ onEdit }: UpdateCommentProps) => {
  return (
    <Dropdown.Item
      id="edit"
      textValue="Edit"
      onAction={onEdit}
    >
      <div className="flex h-8 items-center justify-center pt-px">
        <Pencil className="size-4 shrink-0 text-muted" />
      </div>

      <div className="flex flex-col">
        <Label>Edit</Label>
      </div>
    </Dropdown.Item>
  );
};

export default UpdateComment;
