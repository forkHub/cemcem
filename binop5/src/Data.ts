class Data {

    static deleteVarIsi(id: number): void {
        for (let i: number = 0; i < dataObj.stmtAr.length; i++) {
            if (dataObj.stmtAr[i].id == id) {
                dataObj.stmtAr.splice(i, 1);
                return;
            }
        }
    }

    static getArg(id: number): IArg {
        let hasil: IArg;

        dataObj.argAr.forEach((item: IArg) => {
            if (item.id == id) {
                hasil = item;
            }
        })

        if (!hasil) {
            throw new Error('');
        }

        return hasil;
    }

    static buatArg(type: string, indukId: number): IArg {
        let argObj: IArg;
        argObj = {
            id: Id.id,
            refParamId: 0,
            indukId: indukId,
            nama: '',
            type: TY_ARG,
            tipeArg: type,
            value: '0'
        }

        if (type == ARG_REF) {
            argObj.value = '-1';
        }

        dataObj.argAr.push(argObj);
        dataObj.simpan();

        return argObj;
    }
}