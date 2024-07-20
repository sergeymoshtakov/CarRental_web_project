import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleSelectLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
                {i18n.language.toUpperCase()}
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={() => handleSelectLanguage('en')}>English</DropdownItem>
                <DropdownItem onClick={() => handleSelectLanguage('de')}>Deutsch</DropdownItem>
                {/*<DropdownItem onClick={() => handleSelectLanguage('uk')}>Українська</DropdownItem>*/}
                {/*<DropdownItem onClick={() => handleSelectLanguage('ru')}>Русский</DropdownItem>*/}
                <DropdownItem onClick={() => handleSelectLanguage('fr')}>Français</DropdownItem>
                <DropdownItem onClick={() => handleSelectLanguage('it')}>Italiano</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default LanguageSwitcher;