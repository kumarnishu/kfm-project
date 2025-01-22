import { GetMachineDto } from '../../../dto/MachineDto';
import Dialog from '../../Dialog';
import CreateOrEditMachineForm from '../../forms/machines/CreateOrEditMachineForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    machine?: GetMachineDto,
}

function CreateOrEditMachineDialog({ machine, dialog, setDialog }: Props) {
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditMachineDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditMachineForm machine={machine}  setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditMachineDialog

