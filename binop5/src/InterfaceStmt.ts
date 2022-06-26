interface IStmt extends IData {
	stmtType: string;
	prevIdx: number;
}

interface IPanggilFungsi extends IStmt {
	refFungsiIdx: number;
}

interface IVarIsi extends IStmt {
	varId: number,
	expId: number,
	expTipe: string,
	expValue: string	//bila exp adalah value maka diisi dengan value
}

interface IVarIsiBinop extends IStmt {
	refVarId: number,
	refOpr1Id: number,
	refOpr2Id: number,
	refOpId: number
}

interface IVarIsiPanggilFungsi extends IStmt {
	refVarId: number,
	refFungId: number,


}
