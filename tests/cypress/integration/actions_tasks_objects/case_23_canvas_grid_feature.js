// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

import { taskName } from '../../support/const';

context('Canvas grid feature', () => {
    const caseId = '23';
    const settingsGridSize = 50;
    const gridColor = 'Black';
    const gridOpacity = 80;

    function generateString(countPointsToMove) {
        let action = '';
        for (let i = 0; i < countPointsToMove; i++) {
            action += '{leftarrow}';
        }
        return action;
    }

    before(() => {
        cy.openTaskJob(taskName);
    });

    describe(`Testing case "${caseId}"`, () => {
        it('Go to settings.', () => {
            cy.openSettings();
        });
        it('Set "Show grid" to true.', () => {
            cy.get('.cvat-player-settings-grid').click();
        });
        it('Set "Grid size" to 50.', () => {
            cy.get('.cvat-player-settings-grid-size-input').within(() => {
                cy.get('[role="spinbutton"]').clear().type(settingsGridSize);
            });
        });
        it('Set "Grid color" to black.', () => {
            cy.get('.cvat-player-settings-grid-color-input').click();
            cy.get('.ant-select-dropdown')
                .not('.ant-select-dropdown-hidden')
                .within(() => {
                    cy.get(`.ant-select-item-option[title="${gridColor}"]`).click();
                });
        });
        it('Set "Grid opacity" to 80%.', () => {
            cy.get('.cvat-player-settings-grid-opacity-input').within(() => {
                cy.get('[role="slider"]').type(generateString(20)); // Moving the slider to the left up to 80.
                cy.get('[role="slider"]').should('have.attr', 'aria-valuenow', gridOpacity);
            });
        });
        it('Canvas has grid drawn, it is black, cells are 50x50px and it has 80% opacity.', () => {
            cy.get('#cvat_canvas_grid')
                .should('be.visible') // expected <svg#cvat_canvas_grid> to be visible
                .within(() => {
                    cy.get('#cvat_canvas_grid_pattern')
                        .and('have.attr', 'width', settingsGridSize) // expected to have attribute width with the value '50'
                        .and('have.attr', 'height', settingsGridSize) // expected to have attribute height with the value '50'
                        .and(
                            'have.attr',
                            'style',
                            `stroke: ${gridColor.toLowerCase()}; opacity: ${gridOpacity / 100};`,
                        ); // expected to have attribute style with the value stroke: black; opacity: 0.8;
                });
        });
    });
});
