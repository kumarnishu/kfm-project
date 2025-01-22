import { GetUserDto } from '../../../dto/UserDto';
import Dialog from '../../Dialog';
import CreateOrEditEngineerForm from '../../forms/engineers/CreateOrEditEngineerForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    engineer?: GetUserDto,
    customer: string
}

function CreateOrEditEngineerDialog({ engineer, customer, dialog, setDialog }: Props) {
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditEngineerDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditEngineerForm customer={customer} staff={engineer} setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditEngineerDialog

