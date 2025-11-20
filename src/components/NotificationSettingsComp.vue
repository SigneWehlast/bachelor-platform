<script setup>
</script>
<template>
    <div>
        <div class="notification-topbar">           
            <h3>Notifikations indstillinger</h3>
            <button class="notification-topbar__btn">Gem</button>
        </div> 
        <div class="notification-settings">
            <div class="notification-settings__left">
                <div class="nofication-settings__section">
                    <h4>Generelle notifikationer</h4>
                    <div class="notification-settings__section-group">
                        <div class="notification-settings__section-group__check">
                            <input type="checkbox" value="all"></input>
                            <p class="regular">Alle notifikationer</p>
                        </div>
                        <p class="light">Når denne funktion er slået fra, modtager du ingen notifikationer fra Slack, e-mail eller platformen - heller ikke hvis du normalt har dem aktiveret. Når den er slået til, genaktiveres alle notifikationer som normalt.</p>
                    </div>
                    <div class="notification-settings__section-group">
                        <div class="notification-settings__section-group__check">
                            <input type="checkbox" value="email"></input>
                            <p class="regular">E-mail</p>
                            <input class="group-check" type="checkbox" value="slack"></input>
                            <p class="regular">Slack</p>
                            <input class="group-check" type="checkbox" value="platform"></input>
                            <p class="regular">CarAds platform</p>
                        </div>
                        <p class="light">Når denne funktion er slået fra, modtager du ingen notifikationer fra valgte kommunikationskanaler. Når den er slået til, genaktiveres notifikationer som normalt, på de valgte.</p>
                    </div>
                </div>
                <div class="nofication-settings__section">
                    <h4>CarBoost</h4>
                    <div class="notification-settings__section-group">
                        <div class="notification-settings__section-group__check">
                            <input type="checkbox" value="leads-down"></input>
                            <p class="regular">Faldende antal i leads</p>
                        </div>
                        <p class="light">Når denne funktion er slået til, modtager du notifikationer omkring faldende antal af leads blandt kunderne.</p>
                    </div>
                    <div class="notification-settings__section-group">
                        <div class="notification-settings__section-group__check">
                            <input type="checkbox" value="leads-up"></input>
                            <p class="regular">Stigende antal i leads</p>
                        </div>
                        <p class="light">Når denne funktion er slået til, modtager du notifikationer omkring stigende antal af leads blandt kunderne.</p>
                    </div>
                </div>
            </div>
            <div class="notification-settings__right nofication-settings__section">
                <h4>Kundeændringer</h4>
                <div class="notification-settings__section-group">
                    <div class="notification-settings__section-group__check">
                        <input type="checkbox" value="new-customers"></input>
                        <p class="regular">Nye kunder</p>
                    </div>
                    <p class="light">Når denne funktion er slået til, modtager du notifikationer om nye kunder.</p>
                </div>
                <div class="notification-settings__section-group">
                    <div class="notification-settings__section-group__check">
                        <input type="checkbox" value="new-subscriptions"></input>
                        <p class="regular">Abonnements ændringer</p>
                    </div>
                    <p class="light">Når denne funktion er slået til, modtager du notifikationer om abonnementsændringer hos kunderne.</p>
                </div>
                <div class="notification-settings__section-group">
                    <div class="notification-settings__section-group__check">
                        <input type="checkbox" value="resigned-costumers"></input>
                        <p class="regular">Opsagte kunder</p>
                    </div>
                    <p class="light">Når denne funktion er slået til, modtager du notifikationer om opsagte kunder.</p>
                </div>        
            </div>
        </div>
    </div>
</template>