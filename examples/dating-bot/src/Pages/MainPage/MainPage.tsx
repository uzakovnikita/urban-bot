import React from 'react';
import { Text } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { BotContextType } from '@urban-bot/core/dist/context';
import { Profile } from '../../Common/api/requests/types';

type Props = {
    botContext: BotContextType<UrbanBotTelegram>;
    profile?: Profile;
};

export function MainPage({ botContext, profile }: Props) {
    if (!profile) {
        return (
            <Text>
                {`${botContext.chat.firstName} ${botContext.chat.lastName}`}, добро пожаловать в <i>Tindergram</i>{' '}
                <br />
                Вы должно создать профиль <br />
                <b>/profile</b> - Профиль <br />
            </Text>
        );
    }

    return (
        <Text>
            {`${profile.name}`}, добро пожаловать в <i>Tindergram</i> <br />
            <b>/dating</b> - Поиск пары <br />
            <b>/profile</b> - Профиль <br />
        </Text>
    );
}
