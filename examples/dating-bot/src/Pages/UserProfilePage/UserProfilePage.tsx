import React, { useCallback, useEffect, useState } from 'react';
import { UserProfile } from '../../Components/UserProfile/UserProfile';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { BotContextType } from '@urban-bot/core/dist/context';
import { Profile } from '../../Common/api/requests/types';
import { useGetUserProfilePhoto } from '../../Common/hooks/useUserProfilePhoto';
import { useCommandWithParameters } from '../../Common/hooks/useCommandWithParameters';
import { Button, ButtonGroup, Text } from '@urban-bot/core';

type Props = {
    botContext: BotContextType<UrbanBotTelegram>;
    profile?: Profile;
};

export function UserProfilePage({ botContext, profile }: Props) {
    const [avatar, setAvatar] = useState(profile?.avatar);
    const [description, setDescription] = useState(profile?.description || '');
    const [name, setName] = useState(profile?.name || `${botContext.chat.firstName} ${botContext.chat.lastName}`);
    const [birthday, setBirthday] = useState(profile?.birthday || new Date());
    const photo = useGetUserProfilePhoto(botContext.bot, botContext.chat);

    useEffect(() => {
        setTimeout(() => {
            if (!avatar && !photo.loading && !photo.error && photo.data) {
                setAvatar(photo.data.file_id);
            }
        }, 2000);
    }, [photo, avatar]);

    useCommandWithParameters('/setDescription', (...newDescription: string[]) => {
        if (newDescription) {
            setDescription(newDescription.join(' '));
        }
    });

    useCommandWithParameters('/setName', (newName: string) => {
        if (newName) {
            setName(newName);
        }
    });

    useCommandWithParameters('/setBirthday', (newBirthday: string) => {
        if (newBirthday) {
            const parsedDate = Date.parse(newBirthday);
            if (isNaN(parsedDate)) {
                setBirthday(new Date(parsedDate));
            }
        }
    });

    const handleAddProfile = useCallback(() => {}, []);

    if (!avatar) {
        return null;
    }

    return (
        <>
            <UserProfile
                profile={{
                    id: botContext.chat.id,
                    name: name,
                    avatar: avatar,
                    description: description,
                    birthday: birthday,
                }}
                buttons={
                    <ButtonGroup title="Buttons">
                        <Button onClick={handleAddProfile}>Создать пользователя</Button>
                    </ButtonGroup>
                }
            />
            <Text>
                <b>/setDescription</b> <i>текст</i> - Установить графу {"'О себе'"}
                <br />
                <b>/setName</b> <i>текст</i>- Установить псевдоним <br />
                <b>/setBirthday</b> <i>дд.мм.гггг</i> - Установить дату рождения <br />
            </Text>
        </>
    );
}
