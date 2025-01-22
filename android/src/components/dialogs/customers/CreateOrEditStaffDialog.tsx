import { GetCustomerDto } from '../../../dto/CustomerDto';
import { GetUserDto } from '../../../dto/UserDto';
import Dialog from '../../Dialog';
import CreateOrEditCustomerForm from '../../forms/customers/CreateOrEditCustomerForm';
import CreateOrEditStaffForm from '../../forms/customers/CreateOrEditStaffForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    staff?: GetUserDto,
    customer: string
}

function CreateOrEditStaffDialog({ staff, customer, dialog, setDialog }: Props) {
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditStaffDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditStaffForm customer={customer} staff={staff} setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditStaffDialog

