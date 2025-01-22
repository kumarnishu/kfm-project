import { GetCustomerDto } from '../../../dto/CustomerDto';
import Dialog from '../../Dialog';
import CreateOrEditCustomerForm from '../../forms/customers/CreateOrEditCustomerForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    customer?: GetCustomerDto
}

function CreateOrEditCustomerDialog({ customer, dialog, setDialog }: Props) {
   
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditCustomerDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditCustomerForm customer={customer} setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditCustomerDialog

