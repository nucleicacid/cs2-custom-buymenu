import { CSDamageFlags, CSDamageTypes, CSInputs, CSPlayerController, Entity, Instance } from "cs_script/point_script";

const weapons = new Map([
  // Pistols
  ["glock", 200],
  ["hkp2000", 200],
  ["usp_silencer", 200],
  ["p250", 300],
  ["fiveseven", 500],
  ["tec9", 500],
  ["cz75a", 500],
  ["elite", 300],
  ["deagle", 700],
  ["revolver", 600],
  // SMGs
  ["mac10", 1050],
  ["mp9", 1250],
  ["mp7", 1500],
  ["mp5sd", 1500],
  ["ump45", 1200],
  ["p90", 2350],
  ["bizon", 1400],
  // Rifles
  ["galilar", 1800],
  ["famas", 2050],
  ["ak47", 2700],
  ["m4a1", 2900],
  ["m4a1_silencer", 2900],
  ["ssg08", 1700],
  ["sg556", 3000],
  ["aug", 3300],
  ["awp", 4750],
  ["g3sg1", 5000],
  ["scar20", 5000],
  // Heavy
  ["nova", 1050],
  ["xm1014", 2000],
  ["sawedoff", 1100],
  ["mag7", 1300],
  ["m249", 5200],
  ["negev", 1700],
  // Equipment
  ["taser", 200],
]);

let menuLayout = null;
function GetMenuLayout() {
    if (!(menuLayout instanceof Entity) || !menuLayout.IsValid()) {
        menuLayout = Instance.FindEntitiesByName("buymenu")[0];
    }
    return Instance.FindEntitiesByName("buymenu")[0];
}

const buyMenuOpen = {};

function SetBuyMenu(playerSlot, open) {
    GetMenuLayout().SetHasClassForPlayer(playerSlot, "dialog", "Dismissed", !open);
    GetMenuLayout().SetInputCaptureEnabled(playerSlot, open);
    buyMenuOpen[playerSlot] = open;
}

function ToggleBuyMenu(playerSlot) {
    SetBuyMenu(playerSlot, !buyMenuOpen[playerSlot]);
}

Instance.SetThink(() => {
    for (const controller of Instance.GetAllPlayerControllers()) {
        if (!controller.IsConnected() || controller.IsBot()) continue;
        const pawn = controller.GetPlayerPawn();
        if (!pawn) continue;
        if (pawn.WasInputJustPressed(CSInputs.USE)) {
            ToggleBuyMenu(controller.GetPlayerSlot());
        }
    }
    Instance.SetNextThink(Instance.GetGameTime());
});
Instance.SetNextThink(Instance.GetGameTime());

Instance.OnCustomHudClicked((event) => {
    const pawn = event.player.GetPlayerPawn();
    let primary = pawn.FindWeaponBySlot(0);
    let secondary = pawn.FindWeaponBySlot(1);

    if (event.layout === GetMenuLayout()) {
        purchaseWeapon(event.buttonId, pawn, event.player);
    }
});

function purchaseWeapon(weaponName, pawn, player) {
    const primary = pawn.FindWeaponBySlot(0);
    const secondary = pawn.FindWeaponBySlot(1);
    let cost = weapons.get(weaponName)

    if (player.GetMoneySpendableNow() >= cost) {
        pawn.DropWeapon(primary);
        pawn.GiveNamedItem(weaponName, true);
        player.AddMoneySpendableNow(-cost);
    }
}

Instance.RegisterCheatCommand("toggle_buymenu", () => {
    for (const player of Instance.GetAllPlayerControllers()) {
        ToggleBuyMenu(player.GetPlayerSlot()); 
    }
});
