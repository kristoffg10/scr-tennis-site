import { defineStore } from 'pinia';

export const usePermissionStore = defineStore('permissions', {
    // arrow function recommended for full type inference
    state: () => {
        return {
            permissions: [
                {
                    name: 'Homepage',
                    unique: 'pages-homepage',
                    route_name: ['homepageSection_id', 'metadata_id']
                },
                {
                    name: 'Services',
                    unique: 'pages-services',
                    route_name: ['servicesSection_id', 'metadata_id']
                },
                {
                    name: 'Claims',
                    unique: 'pages-claims',
                    route_name: ['claimsSection_id', 'metadata_id']
                },
                {
                    name: 'Products',
                    unique: 'pages-products',
                    route_name: ['productsSection_id', 'metadata_id']
                },
                {
                    name: 'Partnerships & Accreditations',
                    unique: 'pages-partnerships-accreditations',
                    route_name: ['partnershipsAccreditationsSection_id', 'metadata_id']
                },
                {
                    name: 'Request for Proposal',
                    unique: 'pages-request-for-proposal',
                    route_name: ['requestForProposalSection_id', 'metadata_id']
                },
                {
                    name: 'About Us',
                    unique: 'pages-about-us',
                    route_name: ['aboutUsSection_id', 'otherProperty_id', 'officers_id', 'metadata_id']
                },
                {
                    name: 'Resources',
                    unique: 'pages-resources',
                    route_name: ['resourcesSection_id', 'metadata_id']
                },
                {
                    name: 'Contact Us',
                    unique: 'pages-contact-us',
                    route_name: ['contactUsSection_id', 'metadata_id']
                },
                {
                    name: 'Compliance Commitment',
                    unique: 'pages-compliance-commitment',
                    route_name: ['complianceCommitmentSection_id', 'metadata_id']
                },
                {
                    name: 'Privacy Policy',
                    unique: 'pages-privacy-policy',
                    route_name: ['policySection_id', 'metadata_id']
                },
                {
                    name: 'Legal Disclaimer',
                    unique: 'pages-legal-disclaimer',
                    route_name: ['legalDisclaimerSection_id', 'metadata_id']
                },
                {
                    name: 'Agents',
                    unique: 'agents',
                    route_name: ['agents', 'agents-id', 'agents-create']
                },
                {
                    name: 'Providers',
                    unique: 'providers',
                    route_name: ['providers', 'providers-id', 'providers-create']
                },
                {
                    name: 'Leaders',
                    unique: 'leaders',
                    route_name: ['leaders', 'leaders-id', 'leaders-create']
                },
                {
                    name: 'Annual Reports',
                    unique: 'annual-reports',
                    route_name: ['annual-reports', 'annual-reports-id', 'annual-reports-create']
                },
                {
                    name: 'Article Categories',
                    unique: 'taxonomies-article-categories',
                    route_name: ['taxonomies-media-center-article-categories']
                },
                {
                    name: 'Email Recipients',
                    unique: 'taxonomies-email-recipients',
                    route_name: ['taxonomies-email-recipients-form-pages', 'taxonomies-email-recipients-form-pages-id', 'taxonomies-email-recipients-form-pages-create']
                },
                {
                    name: 'Global CTA',
                    unique: 'taxonomy-cta',
                    route_name: ['taxonomy-cta', 'taxonomy-cta-id', 'taxonomy-cta-create']
                },
                {
                    name: 'News and Articles',
                    unique: 'news-and-articles',
                    route_name: [
                        'articles',
                        'articles-id',
                        'articles-create'
                    ],
                },
                {
                    name: 'Plans & Plan Types',
                    unique: 'plans',
                    route_name: ['plans', 'plans-id', 'plans-create']
                },
                {
                    name: 'Individual Plan Availments',
                    unique: 'plan-availments',
                    route_name: [
                        'plans-availments',
                        'plans-availments-planId',
                        'plans-availments-planId-id',
                        'plans-availments-planId-create'
                    ]
                },
                {
                    name: 'Plan FAQs',
                    unique: 'plan-faqs',
                    route_name: [
                        'plans-faqs',
                        'plans-faqs-planId',
                        'plans-faqs-planId-id',
                        'plans-faqs-planId-create'
                    ]
                },
                {
                    name: 'Plan Highlights',
                    unique: 'plan-highlights',
                    route_name: [
                        'plans-highlights',
                        'plans-highlights-planId',
                        'plans-highlights-planId-id',
                        'plans-highlights-planId-create'
                    ]
                },
                {
                    name: 'Group Plan Riders',
                    unique: 'plan-riders',
                    route_name: [
                        'plans-riders',
                        'plans-riders-planId',
                        'plans-riders-planId-id',
                        'plans-riders-planId-create'
                    ]
                },
                {
                    name: 'Careers',
                    unique: 'careers',
                    route_name: ['careers', 'careers-id', 'careers-create']
                },
                {
                    name: 'Users',
                    unique: 'cms-editors',
                    route_name: [
                        'admin-settings-cms-editors',
                        'admin-settings-cms-editors-id-change-password',
                        'admin-settings-cms-editors-id-update',
                        'admin-settings-cms-editors-create'
                    ]
                },
                {
                    name: 'Roles',
                    unique: 'roles',
                    route_name: [
                        'admin-settings-roles',
                        'admin-settings-roles-id',
                        'admin-settings-roles-create'
                    ]
                },
                {
                    name: 'Website Settings',
                    unique: 'admin-settings-website-settings',
                    route_name: ['admin-settings-website-settings']
                },
            ],
        };
    },

});
