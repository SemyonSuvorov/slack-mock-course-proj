import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-joincode";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name:string;
    joinCode:string;
}

export const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode
}: InviteModalProps) => {
    const workspaceId = useWorkspaceId();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will deactivate the current invite code and generate a new one"
    );

    const handleCopy = async () => {
        const ok = await confirm();
        if(!ok) return;
        const inviteLink = `${window.location.origin}/join/${workspaceId}`
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    };

    const { mutate, isPending } = useNewJoinCode();

    const handleNewCode = () => {
        mutate({workspaceId}, {
            onSuccess: () => {
                toast.success("Invite code regenerated")
            },
            onError: () => {
                toast.error("Failed to regenerate invite code")
            }
        })
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>Use the code below to invite people to your workspace</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm"
                        >
                            Copy link
                            <CopyIcon className="size-4 ml-2"/>
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            onClick={handleNewCode}
                            variant="outline"
                            disabled={isPending}
                        >
                            New code
                        <RefreshCcw className="size-4 ml-2"/>
                        </Button>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};