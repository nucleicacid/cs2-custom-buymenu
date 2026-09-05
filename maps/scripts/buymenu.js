import { CSDamageFlags, CSDamageTypes, CSInputs, Entity, Instance } from "cs_script/point_script";

let menuLayout = null;
function GetWelcomeLayout() {
    if (!(menuLayout instanceof Entity) || !menuLayout.IsValid()) {
        menuLayout = Instance.FindEntitiesByName("welcome_layout")[0];
    }
    return Instance.FindEntitiesByName("welcome_layout")[0];
}

const buyMenuOpen = {};

function SetBuyMenu(playerSlot, open) {
    GetWelcomeLayout().SetHasClassForPlayer(playerSlot, "dialog", "Dismissed", !open);
    GetWelcomeLayout().SetInputCaptureEnabled(playerSlot, open);
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

    if (event.layout === GetWelcomeLayout() && event.buttonId === "buy_ak47") {
        event.player.AddMoneySpendableNow(-2700);
        pawn.DropWeapon(primary);
        pawn.GiveNamedItem("weapon_ak47", true);
    }
    if (event.layout === GetWelcomeLayout() && event.buttonId === "buy_m4a1_silencer") {
        event.player.AddMoneySpendableNow(-2900);
        pawn.DropWeapon(primary);
        pawn.GiveNamedItem("weapon_m4a1_silencer", true);
    }
    if (event.layout === GetWelcomeLayout() && event.buttonId === "buy_m4a1") {
        event.player.AddMoneySpendableNow(-2900);
        pawn.DropWeapon(primary);
        pawn.GiveNamedItem("weapon_m4a1", true);
    }
    if (event.layout === GetWelcomeLayout() && event.buttonId === "buy_awp") {
        event.player.AddMoneySpendableNow(-4750);
        pawn.DropWeapon(primary);
        pawn.GiveNamedItem("weapon_awp", true);
    }
});

Instance.RegisterCheatCommand("toggle_buymenu", () => {
    for (const player of Instance.GetAllPlayerControllers()) {
        ToggleBuyMenu(player.GetPlayerSlot());
    }
});
