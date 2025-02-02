import React from 'react'
import { useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../../..';
import { GetAllMachinesDropdown } from '../../../services/MachineService';
import { AlertContext } from '../../../contexts/AlertContext';
import { EditSparePartsMachines } from '../../../services/SparePartService';
import { EditSparePartMachinesDto, GetSparePartDto, } from '../../../dtos/SparePartDto';
import { DropDownDto } from '../../../dtos/DropDownDto';
import Dialog from '../../common/Dialog';
import { Button, Text } from 'react-native';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    part: GetSparePartDto,
    selectedMachines: string[]
    setSelectedMachines: React.Dispatch<React.SetStateAction<string[]>>
}

function EditSparePartsMachinesDialog({ part, dialog, selectedMachines, setSelectedMachines, setDialog }: Props) {
    const { data: machinesData } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>('machines', GetAllMachinesDropdown);
    const { setAlert } = useContext(AlertContext);
    const { mutate, isLoading } = useMutation<AxiosResponse<{ message: string }>, BackendError, { body: EditSparePartMachinesDto }>(
        EditSparePartsMachines,
        {
            onSuccess: () => {
                setAlert({ message: 'success', color: 'success' })
                setDialog(undefined)
            },
            onError: (error) => {
                error && setAlert({ message: error.response?.data?.message || 'An error occurred', color: 'error' });
            },
        }
    );


    function handleSubmit() {
        mutate({ body: { machine_ids: selectedMachines, part_id: part._id } })
    }

    return (
       <Dialog fullScreen={true} visible={dialog === 'EditSparePartsMachinesDialog'} handleClose={() => setDialog(undefined)}
        >
            <Text>{part.partno}</Text>
            {/* <MultiSelectComponent selectedItems={selectedMachines} setSelectedItems={setSelectedMachines} items={machinesData?.data || []} /> */}
        </Dialog>
    )
}

export default EditSparePartsMachinesDialog

