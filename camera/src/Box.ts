let imgDrag: boolean = false;	//img is dragged or not
let imgDragX: number = 0;		//img x position when dragged
let imgDragY: number = 0;		//img y position when dragged

let ratio: number = 0;
let w2: number = 0;
let normalFl: boolean = false;
let gw: number = 800;
let gh: number = 400;
let boxIdx: number = 0;

let debugEl: HTMLElement;

async function Start(): Promise<void> {
	Graphics(gw, gh);

	await load();
	await gantiGambar('./img/depan.jpg', -1200);

	debugEl = ha.comp.Util.getEl('div.debug');
}

function normalize(): void {
	// let b: boolean = true;
	// if (b) return;

	if (spot.img.x > gw) {
		spot.img.x -= w2;

		// for (let i: number = 0; i < spot.tbl.length; i++) {
		// 	let tbl: ITombol = spot.tbl[i];
		// 	tbl.x -= w2;
		// }

		console.log('normalize >');
		console.log('w2 ' + w2);
		console.log('img x ' + spot.img.x);
	}
	else if ((spot.img.x + w2) < 0) {
		spot.img.x += w2;

		// for (let i: number = 0; i < spot.tbl.length; i++) {
		// 	let tbl: ITombol = spot.tbl[i];
		// 	tbl.x += w2;
		// }

		console.log('normalize <');
		console.log('w2 ' + w2);
		console.log('img x ' + spot.img.x);
	}
}

function getBox(): void {
	boxIdx++;
	if (boxIdx >= spot.tbl.length) {
		boxIdx = 0;
	}
	console.log('get box ' + boxIdx);
}

async function Loop(): Promise<void> {
	Cls();

	if (InputDown()) {
		imgDrag = true;
		imgDragX = spot.img.x;
		imgDragY = spot.img.y;
	}
	else {
		if (imgDrag) {
			imgDrag = false;
			imgDrag = false;
			spot.img.x = imgDragX;
			spot.img.y = imgDragY;
			normalize();
		}
	}

	// Input

	if (InputDrag() && imgDrag) {
		imgDragX = spot.img.x + InputDragX();
		imgDragY = spot.img.y + InputDragY();
	}

	gambar();

	if (InputHit() > 0) {
		console.log('hit: x: ' + (InputX() - spot.img.x) + '/y: ' + InputY());
		await checkHit();
	}


	//debug
	// let str: string = '';
	// str += 'img x: ' + spot.img.x + '<br/>';
	// debugEl.innerHTML = str;

}

function geser(jml: number): void {
	// let b: boolean = true;
	// if (b) return;

	console.log('geser' + jml);

	spot.img.x = jml;
	imgDragX = spot.img.x;
	imgDragY = 0;

	// for (let i: number = 0; i < spot.tbl.length; i++) {
	// 	let tbl: ITombol = spot.tbl[i];
	// 	tbl.x = spot.img.x + tbl.x;
	// }

	normalize();
}

async function load(): Promise<void> {

	if (!spot.img.img) {
		ha.comp.loading.tampil();
		spot.img.img = await LoadImage(spot.img.url);
		await ha.comp.Util.delay(500);
	}

	for (let i: number = 0; i < spot.tbl.length; i++) {
		let tbl: ITombol = spot.tbl[i];

		if (!tbl.img) {
			ha.comp.loading.tampil();
			tbl.img = await LoadImage(tbl.url);
			await ha.comp.Util.delay(500);
		}
	}

	ratio = gh / spot.img.img.height;
	ResizeImage(spot.img.img, Math.ceil(spot.img.img.width * ratio), Math.ceil(spot.img.img.height * ratio));
	w2 = Math.ceil(spot.img.img.width * ratio);

}

function gambar() {

	DrawImage(spot.img.img, imgDragX, 0);
	DrawImage(spot.img.img, imgDragX - w2, 0);
	DrawImage(spot.img.img, imgDragX + w2, 0);

	for (let i: number = 0; i < spot.tbl.length; i++) {
		let tbl: ITombol = spot.tbl[i];
		try {
			DrawImage(tbl.img, imgDragX + tbl.x, tbl.y);
			DrawImage(tbl.img, imgDragX + tbl.x - w2, tbl.y);
			DrawImage(tbl.img, imgDragX + tbl.x + w2, tbl.y);
		}
		catch (e) {
			console.log('idx ' + i);
			throw Error();
		}
	}
}

async function checkHit(): Promise<void> {
	for (let i: number = 0; i < spot.tbl.length; i++) {
		let tbl: ITombol = spot.tbl[i];
		let inputX: number = InputX() - spot.img.x;

		if (ImageDotCollide(tbl.img, tbl.x, tbl.y, inputX, InputY())) {

			//collide tombol
			console.log('collide tombol normal');
			await gantiGambar(tbl.target, tbl.geser);
		}
		else if (ImageDotCollide(tbl.img, tbl.x, tbl.y, inputX - w2, InputY())) {
			//collide tombol
			console.log('collide tombol normal');
			await gantiGambar(tbl.target, tbl.geser);

		}
		else if (ImageDotCollide(tbl.img, tbl.x, tbl.y, inputX + w2, InputY())) {
			//collide tombol
			console.log('collide tombol normal');
			await gantiGambar(tbl.target, tbl.geser);

		}

	}
}

async function gantiGambar(gbr: string, geserJml: number): Promise<void> {
	for (let i: number = 0; i < spots.length; i++) {
		let spotItem: ISpot = spots[i];
		if (spotItem.img.url == gbr) {
			spot = spotItem;
			await load();
			geser(geserJml);
			gambar();
			setTimeout(() => {
				ha.comp.loading.detach();
			}, 500);
			return;
		}
	}

	throw Error('gbr tidak ketemu ' + gbr);
}