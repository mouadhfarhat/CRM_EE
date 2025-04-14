import { Injectable } from '@angular/core';
import { Formation } from '../../domains/formation';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
    getClientsData() {
        return [
            {
                id: '1000',
                username: 'johndoe',
                image: 'john-doe.jpg',
                email: 'john.doe@example.com',
                password: 'securepassword123',
                role: 'user',
                domaine: 'IT',
                history: this.getSampleFormations().slice(0, 3),
                favorites: this.getSampleFormations().slice(3, 6),
                certifications: 'AWS Certified, Angular Expert'
            },
            {
                id: '1001',
                username: 'alicesmith',
                image: 'alice-smith.jpg',
                email: 'alice.smith@example.com',
                password: 'alicepassword456',
                role: 'admin',
                domaine: 'Marketing',
                history: this.getSampleFormations().slice(1, 4),
                favorites: this.getSampleFormations().slice(4, 7),
                certifications: 'Google Ads, Facebook Marketing'
            },
            {
                id: '1002',
                username: 'bobjohnson',
                image: 'bob-johnson.jpg',
                email: 'bob.johnson@example.com',
                password: 'bobpass789',
                role: 'user',
                domaine: 'Finance',
                history: this.getSampleFormations().slice(2, 5),
                favorites: this.getSampleFormations().slice(5, 8),
                certifications: 'CFA Level 1'
            },
            {
                id: '1003',
                username: 'emilywilson',
                image: 'emily-wilson.jpg',
                email: 'emily.wilson@example.com',
                password: 'emilypass321',
                role: 'premium',
                domaine: 'Design',
                history: this.getSampleFormations().slice(3, 6),
                favorites: this.getSampleFormations().slice(6, 9),
                certifications: 'Adobe Certified Expert'
            },
            {
                id: '1004',
                username: 'michaelbrown',
                image: 'michael-brown.jpg',
                email: 'michael.brown@example.com',
                password: 'michaelpass654',
                role: 'user',
                domaine: 'Healthcare',
                history: this.getSampleFormations().slice(4, 7),
                favorites: this.getSampleFormations().slice(7, 10),
                certifications: 'Medical License'
            },
            {
                id: '1005',
                username: 'sarahdavis',
                image: 'sarah-davis.jpg',
                email: 'sarah.davis@example.com',
                password: 'sarahpass987',
                role: 'editor',
                domaine: 'Education',
                history: this.getSampleFormations().slice(5, 8),
                favorites: this.getSampleFormations().slice(8, 11),
                certifications: 'Teaching Certificate'
            },
            {
                id: '1006',
                username: 'davidmiller',
                image: 'david-miller.jpg',
                email: 'david.miller@example.com',
                password: 'davidpass123',
                role: 'user',
                domaine: 'Engineering',
                history: this.getSampleFormations().slice(6, 9),
                favorites: this.getSampleFormations().slice(9, 12),
                certifications: 'Professional Engineer'
            },
            {
                id: '1007',
                username: 'jessicawilson',
                image: 'jessica-wilson.jpg',
                email: 'jessica.wilson@example.com',
                password: 'jessicapass456',
                role: 'admin',
                domaine: 'HR',
                history: this.getSampleFormations().slice(7, 10),
                favorites: this.getSampleFormations().slice(10, 13),
                certifications: 'HR Certification'
            },
            {
                id: '1008',
                username: 'robertmoore',
                image: 'robert-moore.jpg',
                email: 'robert.moore@example.com',
                password: 'robertpass789',
                role: 'user',
                domaine: 'Sales',
                history: this.getSampleFormations().slice(8, 11),
                favorites: this.getSampleFormations().slice(11, 14),
                certifications: 'Sales Training Certified'
            },
            {
                id: '1009',
                username: 'jennifertaylor',
                image: 'jennifer-taylor.jpg',
                email: 'jennifer.taylor@example.com',
                password: 'jenniferpass321',
                role: 'premium',
                domaine: 'Consulting',
                history: this.getSampleFormations().slice(9, 12),
                favorites: this.getSampleFormations().slice(12, 15),
                certifications: 'Management Consultant'
            }
        ];
    }

    getClientsWithDetailsData() {
        return [
            {
                id: '1000',
                username: 'johndoe',
                image: 'john-doe.jpg',
                email: 'john.doe@example.com',
                password: 'securepassword123',
                role: 'user',
                domaine: 'IT',
                history: this.getSampleFormations().slice(0, 3),
                favorites: this.getSampleFormations().slice(3, 6),
                certifications: 'AWS Certified, Angular Expert',
                details: {
                    registrationDate: '2020-01-15',
                    lastLogin: '2023-06-20',
                    status: 'active',
                    preferences: {
                        theme: 'dark',
                        notifications: true,
                        language: 'en'
                    },
                    activity: [
                        {
                            date: '2023-06-15',
                            action: 'completed_formation',
                            formationId: '1000'
                        },
                        {
                            date: '2023-06-10',
                            action: 'started_formation',
                            formationId: '1002'
                        }
                    ]
                }
            },
            {
                id: '1001',
                username: 'alicesmith',
                image: 'alice-smith.jpg',
                email: 'alice.smith@example.com',
                password: 'alicepassword456',
                role: 'admin',
                domaine: 'Marketing',
                history: this.getSampleFormations().slice(1, 4),
                favorites: this.getSampleFormations().slice(4, 7),
                certifications: 'Google Ads, Facebook Marketing',
                details: {
                    registrationDate: '2019-05-22',
                    lastLogin: '2023-06-19',
                    status: 'active',
                    preferences: {
                        theme: 'light',
                        notifications: false,
                        language: 'fr'
                    },
                    activity: [
                        {
                            date: '2023-06-18',
                            action: 'created_formation',
                            formationId: '1010'
                        }
                    ]
                }
            },
            {
                id: '1002',
                username: 'bobjohnson',
                image: 'bob-johnson.jpg',
                email: 'bob.johnson@example.com',
                password: 'bobpass789',
                role: 'user',
                domaine: 'Finance',
                history: this.getSampleFormations().slice(2, 5),
                favorites: this.getSampleFormations().slice(5, 8),
                certifications: 'CFA Level 1',
                details: {
                    registrationDate: '2021-03-10',
                    lastLogin: '2023-06-15',
                    status: 'inactive',
                    preferences: {
                        theme: 'dark',
                        notifications: true,
                        language: 'en'
                    },
                    activity: [
                        {
                            date: '2023-05-20',
                            action: 'completed_formation',
                            formationId: '1005'
                        }
                    ]
                }
            }
        ];
    }

    private getSampleFormations(): Formation[] {
        // This would return a subset of your formations data
        // You might want to import the actual FormationService or mock some data
        return [
            { id: '1000', name: 'Bamboo Watch', description: 'Formation Description', price: 65 },
            { id: '1001', name: 'Black Watch', description: 'Formation Description', price: 72 },
            { id: '1002', name: 'Blue Band', description: 'Formation Description', price: 79 },
            { id: '1003', name: 'Blue T-Shirt', description: 'Formation Description', price: 29 },
            { id: '1004', name: 'Bracelet', description: 'Formation Description', price: 15 },
            { id: '1005', name: 'Brown Purse', description: 'Formation Description', price: 120 },
            { id: '1006', name: 'Chakra Bracelet', description: 'Formation Description', price: 32 },
            { id: '1007', name: 'Galaxy Earrings', description: 'Formation Description', price: 34 },
            { id: '1008', name: 'Game Controller', description: 'Formation Description', price: 99 },
            { id: '1009', name: 'Gaming Set', description: 'Formation Description', price: 299 },
            { id: '1010', name: 'Gold Phone Case', description: 'Formation Description', price: 24 }
        ];
    }

    getClientsMini() {
        return Promise.resolve(this.getClientsData().slice(0, 5));
    }

    getClientsSmall() {
        return Promise.resolve(this.getClientsData().slice(0, 10));
    }

    getClients() {
        return Promise.resolve(this.getClientsData());
    }

    getClientsWithDetailsSmall() {
        return Promise.resolve(this.getClientsWithDetailsData().slice(0, 2));
    }

    getClientsWithDetails() {
        return Promise.resolve(this.getClientsWithDetailsData());
    }
}