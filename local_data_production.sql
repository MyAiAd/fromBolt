--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

INSERT INTO _realtime.tenants VALUES ('381e376d-12b3-405a-8bba-fb809c572553', 'realtime-dev', 'realtime-dev', 'iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==', 200, '2025-06-11 05:48:25', '2025-06-11 05:48:25', 100, 'postgres_cdc_rls', 100000, 100, 100, false, '{"keys": [{"k": "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw", "kty": "oct"}]}', false, false, 62);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

-- INSERT INTO _realtime.extensions -- Local development only VALUES ('1cae975b-a7fc-42ec-becc-98ceb5c0e8b3', 'postgres_cdc_rls', '{"region": "us-east-1", "db_host": "6KvtKoP1D+cyUDrTcTQEA2xKgTIxJiJ5MgsJ4pdG57g=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}', 'realtime-dev', '2025-06-11 05:48:25', '2025-06-11 05:48:25');


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

INSERT INTO _realtime.schema_migrations VALUES (20210706140551, '2025-06-11 05:46:18');
INSERT INTO _realtime.schema_migrations VALUES (20220329161857, '2025-06-11 05:46:18');
INSERT INTO _realtime.schema_migrations VALUES (20220410212326, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20220506102948, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20220527210857, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20220815211129, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20220815215024, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20220818141501, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20221018173709, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20221102172703, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20221223010058, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20230110180046, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20230810220907, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20230810220924, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20231024094642, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20240306114423, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20240418082835, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20240625211759, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20240704172020, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20240902173232, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20241106103258, '2025-06-11 05:46:19');
INSERT INTO _realtime.schema_migrations VALUES (20250424203323, '2025-06-11 05:46:19');


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'a3157207-59a0-4a9c-a16a-7504064bb894', '{"action":"user_signedup","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-06-11 05:52:52.715697+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'f2cd5284-dcef-4048-bab0-032214fdd2d4', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 05:52:52.719571+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'd7d8c49a-0c35-41a7-a25b-8325646166e4', '{"action":"user_signedup","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-06-11 06:25:08.122009+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'c2020675-d0ee-4b25-9fc3-e5d65adbac2d', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 06:25:08.129678+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '372f18be-64e4-410b-9b50-ad4d28a69b0b', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 06:28:36.524336+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'b0929e89-d89e-4305-857d-e0bac2314c37', '{"action":"user_repeated_signup","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-11 06:29:42.428137+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '7bf532a1-9b08-4934-876d-87622d0be2b7', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 06:30:02.228324+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '93fcd5a1-5242-48f5-bf15-0dd10f943bfb', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 06:40:40.606704+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'a3f51c6c-beb9-4888-81bc-e62294be685c', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 06:41:09.224262+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '915aa4ca-8e1c-4d2b-8543-6603e53bc200', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 06:41:26.572265+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'd852638d-e7a1-47d6-a13d-b5a9137e6430', '{"action":"token_refreshed","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"token"}', '2025-06-11 07:39:29.081466+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '56b445c2-882a-4168-a7ef-03a6d69bdb02', '{"action":"token_revoked","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"token"}', '2025-06-11 07:39:29.082004+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '479cc356-a626-44bd-b64e-a43ff1105845', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 07:48:15.652659+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '2fd15f8f-a0b6-481e-a9fd-3b70e2f50d78', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 09:14:45.747758+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'd596106a-0fd7-4030-9b3d-74342b20bfe4', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 09:14:45.748643+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'f71cd5f2-d3bd-4682-997f-c5144e6e973d', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 10:13:14.514292+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'b08d89db-077d-4023-9b48-ebc16d905b28', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 10:13:14.514769+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '7aeb4ae9-267f-422b-8ff3-034d6de53f76', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 11:12:22.472917+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'f9854a32-1329-4e6f-85e5-b015ff3fbc4e', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 11:12:22.473315+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '2fa134cb-62f6-4775-b479-a6bd286f77f5', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 12:10:40.35874+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '86af17d6-bf5e-42ea-8259-91982f1203c2', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-11 12:10:40.35926+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '0cbbf068-efe0-4223-988f-1c026e939aa1', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 12:39:03.789243+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'f656a889-19e0-411d-984f-b36fd9fb5e1a', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 12:50:19.763707+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'fb475cc8-9ca3-4d3d-bdf2-9c4c5d81d914', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 13:25:15.933229+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'e7706288-e2ec-48ce-ad7f-50c76256a137', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 13:26:11.662645+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'ba51cc21-3c65-4082-9178-e754865f6920', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 13:27:27.008836+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '58cac1f0-6581-4291-9295-a8186d83e27f', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 13:31:45.989117+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'a4819f69-a363-4cc6-8a18-9232774a46a8', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-12 22:14:26.05374+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '39131dd0-b874-4f84-8281-7d471ff31dcd', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-12 22:14:39.449253+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'fddfed06-ed66-4b69-b3bd-689594d2a14d', '{"action":"login","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-12 22:18:13.738192+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '357c4152-fea2-4666-b811-8ee9f4a2e027', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 04:34:10.569396+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '7b0741e0-21b2-4c96-9cd4-69b56a12588e', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 04:34:10.569873+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'c36bac5c-7111-47e5-bc39-849137568d5b', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 05:32:38.331265+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '622247b0-9c31-4fc2-b3bf-7f4d6f8ccd67', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 05:32:38.332149+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '6ad8a477-1930-4285-af0e-96dc6e247549', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 06:30:38.331539+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '162744dd-943e-4c37-a401-12f60808a805', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 06:30:38.332068+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'c2ebbf64-06e8-478f-98b8-72e4505f40e8', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 07:28:38.329818+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '77269239-0b58-416d-b676-cdb6cc59cd85', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 07:28:38.330399+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '6165cc82-acf6-44ad-a1cf-85cd073615bc', '{"action":"token_refreshed","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 14:13:10.39528+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '44e910a7-15df-4eb2-ac6e-364c2134c55d', '{"action":"token_revoked","actor_id":"19c5fd2a-2960-49d3-9a73-9a3521d392e3","actor_username":"sage@myai.ad","actor_via_sso":false,"log_type":"token"}', '2025-06-13 14:13:10.395862+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '5482032a-1799-4f94-a8a1-84b33c002141', '{"action":"login","actor_id":"24c041d0-4bf6-4d73-817f-749d9a061c18","actor_username":"sage@risewith.us","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-13 14:19:22.634116+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users VALUES (NULL, '00000000-0000-0000-0000-000000000002', NULL, NULL, 'user1@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"name": "Test User 1"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES (NULL, '00000000-0000-0000-0000-000000000003', NULL, NULL, 'user2@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"name": "Test User 2"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES (NULL, '00000000-0000-0000-0000-000000000001', NULL, NULL, 'admin@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"name": "Admin User", "is_admin": "true"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', 'authenticated', 'authenticated', 'sage@myai.ad', '$2a$10$rx2XLMlOmY1jZIQQiNS.P.AARk3RYQIlkvY0D/4XsH28DWRCQN9g6', '2025-06-11 05:52:52.716541+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-06-12 22:18:13.738954+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "19c5fd2a-2960-49d3-9a73-9a3521d392e3", "name": "Sage Michael", "email": "sage@myai.ad", "is_admin": "true", "email_verified": true, "phone_verified": false}', NULL, '2025-06-11 05:52:52.707325+00', '2025-06-13 14:13:10.397464+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '24c041d0-4bf6-4d73-817f-749d9a061c18', 'authenticated', 'authenticated', 'sage@risewith.us', '$2a$10$gFfydce1sIyo13LvGaokMu3m0n8JHsKHw55WI7pd/ZyXRfjzQbohq', '2025-06-11 06:25:08.12248+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-06-13 14:19:22.634819+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "24c041d0-4bf6-4d73-817f-749d9a061c18", "email": "sage@risewith.us", "last_name": "Michael", "first_name": "Sage", "email_verified": true, "phone_verified": false}', NULL, '2025-06-11 06:25:08.117866+00', '2025-06-13 14:19:22.636523+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities VALUES ('19c5fd2a-2960-49d3-9a73-9a3521d392e3', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '{"sub": "19c5fd2a-2960-49d3-9a73-9a3521d392e3", "name": "Sage Michael", "email": "sage@myai.ad", "email_verified": false, "phone_verified": false}', 'email', '2025-06-11 05:52:52.712355+00', '2025-06-11 05:52:52.712406+00', '2025-06-11 05:52:52.712406+00', DEFAULT, '56daa32d-dae2-4dab-852b-01cc715dc1d6');
INSERT INTO auth.identities VALUES ('24c041d0-4bf6-4d73-817f-749d9a061c18', '24c041d0-4bf6-4d73-817f-749d9a061c18', '{"sub": "24c041d0-4bf6-4d73-817f-749d9a061c18", "email": "sage@risewith.us", "last_name": "Michael", "first_name": "Sage", "email_verified": false, "phone_verified": false}', 'email', '2025-06-11 06:25:08.120229+00', '2025-06-11 06:25:08.120264+00', '2025-06-11 06:25:08.120264+00', DEFAULT, 'f5df7339-d676-48fd-91fb-470e202c305e');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.sessions VALUES ('49a9a6b8-f4bb-4ea4-bc34-662c31c390ac', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 05:52:52.720891+00', '2025-06-11 05:52:52.720891+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('d8faca39-75ad-46b7-8681-9f99fab1f0d0', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-11 06:25:08.130296+00', '2025-06-11 06:25:08.130296+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('06853e77-ded8-41b2-905b-bbdcef8a801c', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-11 06:28:36.524951+00', '2025-06-11 06:28:36.524951+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('32af2a00-9d55-4edf-8cca-fa5dfb203ad1', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 06:30:02.229295+00', '2025-06-11 06:30:02.229295+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('259b3869-723b-46e3-a470-461a13bc7f61', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-11 06:40:40.607345+00', '2025-06-11 06:40:40.607345+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('8fa08679-edce-421b-9615-3cbd701838aa', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 06:41:09.225356+00', '2025-06-11 06:41:09.225356+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('d007d962-35fa-41b3-aea2-d09d959acd8c', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-11 06:41:26.573034+00', '2025-06-11 07:39:29.084254+00', NULL, 'aal1', NULL, '2025-06-11 07:39:29.084205', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('f0b620a9-8b2f-4820-871a-05e5ad443df8', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 07:48:15.653482+00', '2025-06-11 12:10:40.361306+00', NULL, 'aal1', NULL, '2025-06-11 12:10:40.361247', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('ec2c9b0d-6b29-4907-a9f7-cc4b49b469c8', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 12:39:03.789974+00', '2025-06-11 12:39:03.789974+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('73af8969-9706-4e92-b438-3ff25398cf04', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 12:50:19.76486+00', '2025-06-11 12:50:19.76486+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('c6022582-802f-4ab4-8805-e8cdcc095f28', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 13:25:15.933945+00', '2025-06-11 13:25:15.933945+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('1457bd63-b7d6-4425-a749-4f58b47052df', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-11 13:26:11.663551+00', '2025-06-11 13:26:11.663551+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('d3e9439d-a3e3-41dc-9b5e-845820175e01', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 13:27:27.009903+00', '2025-06-11 13:27:27.009903+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('34a53aaf-075c-4e3e-a1e9-e17bcd61e0ef', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-11 13:31:45.9898+00', '2025-06-11 13:31:45.9898+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('282cf568-f4aa-49a7-89c0-8aefa4f3266d', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-12 22:14:26.054973+00', '2025-06-12 22:14:26.054973+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('c89e0e2a-b424-48e7-861c-ed12a174d7d8', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-12 22:14:39.450544+00', '2025-06-12 22:14:39.450544+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('3b28ae6c-8e30-4521-818b-d851b1dd00ff', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-12 22:18:13.739023+00', '2025-06-13 14:13:10.398269+00', NULL, 'aal1', NULL, '2025-06-13 14:13:10.398213', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);
INSERT INTO auth.sessions VALUES ('c20d8b9e-fe69-495a-8d1b-419419c27e54', '24c041d0-4bf6-4d73-817f-749d9a061c18', '2025-06-13 14:19:22.634891+00', '2025-06-13 14:19:22.634891+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.mfa_amr_claims VALUES ('49a9a6b8-f4bb-4ea4-bc34-662c31c390ac', '2025-06-11 05:52:52.723923+00', '2025-06-11 05:52:52.723923+00', 'password', '04fd057b-47d0-434b-bb4f-f5ca27b8b8f9');
INSERT INTO auth.mfa_amr_claims VALUES ('d8faca39-75ad-46b7-8681-9f99fab1f0d0', '2025-06-11 06:25:08.131637+00', '2025-06-11 06:25:08.131637+00', 'password', '37ff3bd3-f127-48c4-80a4-5da99324122a');
INSERT INTO auth.mfa_amr_claims VALUES ('06853e77-ded8-41b2-905b-bbdcef8a801c', '2025-06-11 06:28:36.526511+00', '2025-06-11 06:28:36.526511+00', 'password', 'e86067da-066f-4a32-bb18-5105585ff487');
INSERT INTO auth.mfa_amr_claims VALUES ('32af2a00-9d55-4edf-8cca-fa5dfb203ad1', '2025-06-11 06:30:02.231058+00', '2025-06-11 06:30:02.231058+00', 'password', '9ebea2a7-89c7-44d0-bbaf-46855592f40d');
INSERT INTO auth.mfa_amr_claims VALUES ('259b3869-723b-46e3-a470-461a13bc7f61', '2025-06-11 06:40:40.609224+00', '2025-06-11 06:40:40.609224+00', 'password', '90e07457-7feb-4f82-9253-2674ecab5247');
INSERT INTO auth.mfa_amr_claims VALUES ('8fa08679-edce-421b-9615-3cbd701838aa', '2025-06-11 06:41:09.228465+00', '2025-06-11 06:41:09.228465+00', 'password', '167530a0-96ad-4353-aa6f-8936eacd5647');
INSERT INTO auth.mfa_amr_claims VALUES ('d007d962-35fa-41b3-aea2-d09d959acd8c', '2025-06-11 06:41:26.575298+00', '2025-06-11 06:41:26.575298+00', 'password', '896c5c32-eb31-4fd2-a7c7-6a44e51c4c7c');
INSERT INTO auth.mfa_amr_claims VALUES ('f0b620a9-8b2f-4820-871a-05e5ad443df8', '2025-06-11 07:48:15.656251+00', '2025-06-11 07:48:15.656251+00', 'password', '2b6ba4ea-4c0c-4034-8090-6728527d51e7');
INSERT INTO auth.mfa_amr_claims VALUES ('ec2c9b0d-6b29-4907-a9f7-cc4b49b469c8', '2025-06-11 12:39:03.791616+00', '2025-06-11 12:39:03.791616+00', 'password', '1a2d08e9-5b60-4a56-bdc0-e969b451b693');
INSERT INTO auth.mfa_amr_claims VALUES ('73af8969-9706-4e92-b438-3ff25398cf04', '2025-06-11 12:50:19.76709+00', '2025-06-11 12:50:19.76709+00', 'password', '34b1d8e0-ddea-4a41-b455-76437eafafb5');
INSERT INTO auth.mfa_amr_claims VALUES ('c6022582-802f-4ab4-8805-e8cdcc095f28', '2025-06-11 13:25:15.935746+00', '2025-06-11 13:25:15.935746+00', 'password', '3db78138-692a-47e0-9440-9f599f959807');
INSERT INTO auth.mfa_amr_claims VALUES ('1457bd63-b7d6-4425-a749-4f58b47052df', '2025-06-11 13:26:11.665797+00', '2025-06-11 13:26:11.665797+00', 'password', '82d1c550-5163-46bf-977c-812ee090ecf2');
INSERT INTO auth.mfa_amr_claims VALUES ('d3e9439d-a3e3-41dc-9b5e-845820175e01', '2025-06-11 13:27:27.012332+00', '2025-06-11 13:27:27.012332+00', 'password', '21edba71-a23c-40a6-b1ff-df731cb88972');
INSERT INTO auth.mfa_amr_claims VALUES ('34a53aaf-075c-4e3e-a1e9-e17bcd61e0ef', '2025-06-11 13:31:45.991782+00', '2025-06-11 13:31:45.991782+00', 'password', '003d9f90-80cd-41fd-8680-3f89d61899f5');
INSERT INTO auth.mfa_amr_claims VALUES ('282cf568-f4aa-49a7-89c0-8aefa4f3266d', '2025-06-12 22:14:26.057683+00', '2025-06-12 22:14:26.057683+00', 'password', '3070624f-e3e9-409d-82d2-f7bec50f5f44');
INSERT INTO auth.mfa_amr_claims VALUES ('c89e0e2a-b424-48e7-861c-ed12a174d7d8', '2025-06-12 22:14:39.453273+00', '2025-06-12 22:14:39.453273+00', 'password', '69f33103-e24c-431c-b112-f3a4df19806c');
INSERT INTO auth.mfa_amr_claims VALUES ('3b28ae6c-8e30-4521-818b-d851b1dd00ff', '2025-06-12 22:18:13.741301+00', '2025-06-12 22:18:13.741301+00', 'password', '0a93bd3f-0c35-47d4-b9af-ee25f6aaa794');
INSERT INTO auth.mfa_amr_claims VALUES ('c20d8b9e-fe69-495a-8d1b-419419c27e54', '2025-06-13 14:19:22.636779+00', '2025-06-13 14:19:22.636779+00', 'password', '461baa9e-354e-4297-bf32-2972e1269a2d');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 1, 'ezxz4inwppm3', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 05:52:52.722184+00', '2025-06-11 05:52:52.722184+00', NULL, '49a9a6b8-f4bb-4ea4-bc34-662c31c390ac');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 2, 'rbk625uusp64', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-11 06:25:08.130809+00', '2025-06-11 06:25:08.130809+00', NULL, 'd8faca39-75ad-46b7-8681-9f99fab1f0d0');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 3, 'ppsgitngcw5b', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-11 06:28:36.525551+00', '2025-06-11 06:28:36.525551+00', NULL, '06853e77-ded8-41b2-905b-bbdcef8a801c');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 4, 'dtukzy7tq3hf', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 06:30:02.230076+00', '2025-06-11 06:30:02.230076+00', NULL, '32af2a00-9d55-4edf-8cca-fa5dfb203ad1');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 5, 'llpz3jcipqah', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-11 06:40:40.607994+00', '2025-06-11 06:40:40.607994+00', NULL, '259b3869-723b-46e3-a470-461a13bc7f61');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 6, 'fr2ul23hzoz4', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 06:41:09.226585+00', '2025-06-11 06:41:09.226585+00', NULL, '8fa08679-edce-421b-9615-3cbd701838aa');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 7, 'wpoykpo32sic', '24c041d0-4bf6-4d73-817f-749d9a061c18', true, '2025-06-11 06:41:26.573605+00', '2025-06-11 07:39:29.082478+00', NULL, 'd007d962-35fa-41b3-aea2-d09d959acd8c');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 8, 'a3quwjxmvmrx', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-11 07:39:29.082987+00', '2025-06-11 07:39:29.082987+00', 'wpoykpo32sic', 'd007d962-35fa-41b3-aea2-d09d959acd8c');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 9, 'z7iwartzmrva', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-11 07:48:15.654257+00', '2025-06-11 09:14:45.749338+00', NULL, 'f0b620a9-8b2f-4820-871a-05e5ad443df8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 10, 'sudu73rllbso', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-11 09:14:45.750115+00', '2025-06-11 10:13:14.515206+00', 'z7iwartzmrva', 'f0b620a9-8b2f-4820-871a-05e5ad443df8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 11, 'rax3l5n5zx7m', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-11 10:13:14.515482+00', '2025-06-11 11:12:22.473644+00', 'sudu73rllbso', 'f0b620a9-8b2f-4820-871a-05e5ad443df8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 12, 'axxgtzoe4fm2', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-11 11:12:22.473912+00', '2025-06-11 12:10:40.359683+00', 'rax3l5n5zx7m', 'f0b620a9-8b2f-4820-871a-05e5ad443df8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 13, 's4suae7qp7uf', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 12:10:40.359947+00', '2025-06-11 12:10:40.359947+00', 'axxgtzoe4fm2', 'f0b620a9-8b2f-4820-871a-05e5ad443df8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 14, 'qllujiwdnlig', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 12:39:03.790714+00', '2025-06-11 12:39:03.790714+00', NULL, 'ec2c9b0d-6b29-4907-a9f7-cc4b49b469c8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 15, 'ixvvqlmcaakh', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 12:50:19.765934+00', '2025-06-11 12:50:19.765934+00', NULL, '73af8969-9706-4e92-b438-3ff25398cf04');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 16, '67mdjmjouc5t', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 13:25:15.93464+00', '2025-06-11 13:25:15.93464+00', NULL, 'c6022582-802f-4ab4-8805-e8cdcc095f28');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 17, 'vo4phcq3gfrd', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-11 13:26:11.664581+00', '2025-06-11 13:26:11.664581+00', NULL, '1457bd63-b7d6-4425-a749-4f58b47052df');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 18, 'eq5fop44bp43', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-11 13:27:27.010909+00', '2025-06-11 13:27:27.010909+00', NULL, 'd3e9439d-a3e3-41dc-9b5e-845820175e01');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 19, 'dyqbxvyqwwwf', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-11 13:31:45.990625+00', '2025-06-11 13:31:45.990625+00', NULL, '34a53aaf-075c-4e3e-a1e9-e17bcd61e0ef');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 20, '33jluav74v6y', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-12 22:14:26.056186+00', '2025-06-12 22:14:26.056186+00', NULL, '282cf568-f4aa-49a7-89c0-8aefa4f3266d');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 21, 'tcjyoefterxh', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-12 22:14:39.451917+00', '2025-06-12 22:14:39.451917+00', NULL, 'c89e0e2a-b424-48e7-861c-ed12a174d7d8');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 22, '2ysuzgsazebl', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-12 22:18:13.740053+00', '2025-06-13 04:34:10.570277+00', NULL, '3b28ae6c-8e30-4521-818b-d851b1dd00ff');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 23, '7byj2tnph5lh', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-13 04:34:10.570564+00', '2025-06-13 05:32:38.332688+00', '2ysuzgsazebl', '3b28ae6c-8e30-4521-818b-d851b1dd00ff');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 24, 'he6z4o3ptv7h', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-13 05:32:38.332942+00', '2025-06-13 06:30:38.332478+00', '7byj2tnph5lh', '3b28ae6c-8e30-4521-818b-d851b1dd00ff');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 25, 'yxv26ccukpbm', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-13 06:30:38.332707+00', '2025-06-13 07:28:38.33078+00', 'he6z4o3ptv7h', '3b28ae6c-8e30-4521-818b-d851b1dd00ff');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 26, 'xkfsgjgs2txv', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', true, '2025-06-13 07:28:38.330981+00', '2025-06-13 14:13:10.396352+00', 'yxv26ccukpbm', '3b28ae6c-8e30-4521-818b-d851b1dd00ff');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 27, 'kkrjuzm6anit', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', false, '2025-06-13 14:13:10.396596+00', '2025-06-13 14:13:10.396596+00', 'xkfsgjgs2txv', '3b28ae6c-8e30-4521-818b-d851b1dd00ff');
INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 28, 'mzqs67zk4v4p', '24c041d0-4bf6-4d73-817f-749d9a061c18', false, '2025-06-13 14:19:22.635717+00', '2025-06-13 14:19:22.635717+00', NULL, 'c20d8b9e-fe69-495a-8d1b-419419c27e54');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.schema_migrations VALUES ('20171026211738');
INSERT INTO auth.schema_migrations VALUES ('20171026211808');
INSERT INTO auth.schema_migrations VALUES ('20171026211834');
INSERT INTO auth.schema_migrations VALUES ('20180103212743');
INSERT INTO auth.schema_migrations VALUES ('20180108183307');
INSERT INTO auth.schema_migrations VALUES ('20180119214651');
INSERT INTO auth.schema_migrations VALUES ('20180125194653');
INSERT INTO auth.schema_migrations VALUES ('00');
INSERT INTO auth.schema_migrations VALUES ('20210710035447');
INSERT INTO auth.schema_migrations VALUES ('20210722035447');
INSERT INTO auth.schema_migrations VALUES ('20210730183235');
INSERT INTO auth.schema_migrations VALUES ('20210909172000');
INSERT INTO auth.schema_migrations VALUES ('20210927181326');
INSERT INTO auth.schema_migrations VALUES ('20211122151130');
INSERT INTO auth.schema_migrations VALUES ('20211124214934');
INSERT INTO auth.schema_migrations VALUES ('20211202183645');
INSERT INTO auth.schema_migrations VALUES ('20220114185221');
INSERT INTO auth.schema_migrations VALUES ('20220114185340');
INSERT INTO auth.schema_migrations VALUES ('20220224000811');
INSERT INTO auth.schema_migrations VALUES ('20220323170000');
INSERT INTO auth.schema_migrations VALUES ('20220429102000');
INSERT INTO auth.schema_migrations VALUES ('20220531120530');
INSERT INTO auth.schema_migrations VALUES ('20220614074223');
INSERT INTO auth.schema_migrations VALUES ('20220811173540');
INSERT INTO auth.schema_migrations VALUES ('20221003041349');
INSERT INTO auth.schema_migrations VALUES ('20221003041400');
INSERT INTO auth.schema_migrations VALUES ('20221011041400');
INSERT INTO auth.schema_migrations VALUES ('20221020193600');
INSERT INTO auth.schema_migrations VALUES ('20221021073300');
INSERT INTO auth.schema_migrations VALUES ('20221021082433');
INSERT INTO auth.schema_migrations VALUES ('20221027105023');
INSERT INTO auth.schema_migrations VALUES ('20221114143122');
INSERT INTO auth.schema_migrations VALUES ('20221114143410');
INSERT INTO auth.schema_migrations VALUES ('20221125140132');
INSERT INTO auth.schema_migrations VALUES ('20221208132122');
INSERT INTO auth.schema_migrations VALUES ('20221215195500');
INSERT INTO auth.schema_migrations VALUES ('20221215195800');
INSERT INTO auth.schema_migrations VALUES ('20221215195900');
INSERT INTO auth.schema_migrations VALUES ('20230116124310');
INSERT INTO auth.schema_migrations VALUES ('20230116124412');
INSERT INTO auth.schema_migrations VALUES ('20230131181311');
INSERT INTO auth.schema_migrations VALUES ('20230322519590');
INSERT INTO auth.schema_migrations VALUES ('20230402418590');
INSERT INTO auth.schema_migrations VALUES ('20230411005111');
INSERT INTO auth.schema_migrations VALUES ('20230508135423');
INSERT INTO auth.schema_migrations VALUES ('20230523124323');
INSERT INTO auth.schema_migrations VALUES ('20230818113222');
INSERT INTO auth.schema_migrations VALUES ('20230914180801');
INSERT INTO auth.schema_migrations VALUES ('20231027141322');
INSERT INTO auth.schema_migrations VALUES ('20231114161723');
INSERT INTO auth.schema_migrations VALUES ('20231117164230');
INSERT INTO auth.schema_migrations VALUES ('20240115144230');
INSERT INTO auth.schema_migrations VALUES ('20240214120130');
INSERT INTO auth.schema_migrations VALUES ('20240306115329');
INSERT INTO auth.schema_migrations VALUES ('20240314092811');
INSERT INTO auth.schema_migrations VALUES ('20240427152123');
INSERT INTO auth.schema_migrations VALUES ('20240612123726');
INSERT INTO auth.schema_migrations VALUES ('20240729123726');
INSERT INTO auth.schema_migrations VALUES ('20240802193726');
INSERT INTO auth.schema_migrations VALUES ('20240806073726');
INSERT INTO auth.schema_migrations VALUES ('20241009103726');


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: affiliate_import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.affiliate_import_logs VALUES ('1adc19a7-3aca-4f20-acaf-7306a5b9f52c', 'ghl', 'affiliates', 'started', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 11:25:35.793652+00', NULL, 0, 0, 0, 0, NULL, NULL, '{"timestamp": "2025-06-11T11:25:35.779Z", "locationId": "w01Gc7T4b0tKSDQdKhuN"}', '2025-06-11 11:25:35.793652+00');
INSERT INTO public.affiliate_import_logs VALUES ('f7fb0806-ef08-4951-bdf9-f9f6631f14bf', 'ghl', 'affiliates', 'completed', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 11:36:28.954785+00', '2025-06-11 11:36:30.298+00', 100, 100, 0, 0, NULL, NULL, '{"timestamp": "2025-06-11T11:36:28.941Z", "locationId": "w01Gc7T4b0tKSDQdKhuN"}', '2025-06-11 11:36:28.954785+00');
INSERT INTO public.affiliate_import_logs VALUES ('a748b771-f48b-41ab-b3ce-bc3183d73367', 'ghl', 'affiliates', 'completed', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 11:37:23.204184+00', '2025-06-11 11:37:24.679+00', 100, 100, 0, 0, NULL, NULL, '{"timestamp": "2025-06-11T11:37:23.189Z", "locationId": "w01Gc7T4b0tKSDQdKhuN"}', '2025-06-11 11:37:23.204184+00');
INSERT INTO public.affiliate_import_logs VALUES ('fc8b5e8f-3d6d-49df-8238-e1301cbeab2b', 'ghl', 'affiliates', 'completed', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 11:37:53.968026+00', '2025-06-11 11:37:55.351+00', 100, 100, 0, 0, NULL, NULL, '{"timestamp": "2025-06-11T11:37:53.965Z", "locationId": "w01Gc7T4b0tKSDQdKhuN"}', '2025-06-11 11:37:53.968026+00');
INSERT INTO public.affiliate_import_logs VALUES ('aef52dde-8c22-4e53-9f0e-823159bd28c5', 'ghl', 'affiliates', 'completed', '19c5fd2a-2960-49d3-9a73-9a3521d392e3', '2025-06-11 12:29:55.414497+00', '2025-06-11 12:29:56.999+00', 100, 100, 0, 0, NULL, NULL, '{"timestamp": "2025-06-11T12:29:55.400Z", "locationId": "w01Gc7T4b0tKSDQdKhuN"}', '2025-06-11 12:29:55.414497+00');


--
-- Data for Name: affiliate_system_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.affiliate_system_users VALUES ('3b431131-8d6b-4378-a756-bfb555b75b23', 'rima.valunaite@hotmail.com', 'rima', 'valunaite', '+353877653073', 'RIMAA4UZ', 'ghl', '3238ZUFeA4otrQrK9HLn', NULL, NULL, NULL, 'active', '2025-06-10 07:17:36.778+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.272929+00', '2025-06-11 12:29:56.325986+00');
INSERT INTO public.affiliate_system_users VALUES ('2ed58b9a-8aea-4dbc-9afc-b8107a12dcf8', 'klavionial0.23h@live.nl', 'kaila', 'lavio', '+212666622333', 'KAILA6MSW', 'ghl', 'MUzwGKGFwoK7kApiOf3N', NULL, NULL, NULL, 'active', '2025-06-09 19:11:57.486+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.286955+00', '2025-06-11 12:29:56.351289+00');
INSERT INTO public.affiliate_system_users VALUES ('bbe22eb2-89aa-44f4-bf8e-0dd9ec0f6009', 'adrian.danis@yahoo.com', 'adrian', 'danis', '+40721050368', 'ADRIANQ7NB', 'ghl', 'sUHJl88XoESl2T1AlCVf', NULL, NULL, NULL, 'active', '2025-06-09 12:02:17.993+00', '2025-06-09 12:03:58.358+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.295751+00', '2025-06-11 12:29:56.363553+00');
INSERT INTO public.affiliate_system_users VALUES ('43bb6056-d866-4515-8c15-dadcc807fec0', 'aprilsmith1883@gmail.com', 'april', 'smith', NULL, 'APRIL4KYY', 'ghl', 'nUKTRrHB7OUFi7PjqOep', NULL, NULL, NULL, 'active', '2025-06-08 23:47:31.853+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.304443+00', '2025-06-11 12:29:56.374334+00');
INSERT INTO public.affiliate_system_users VALUES ('4adb83e7-c651-40bd-8876-16704b3ba42e', 'ms.green.debbie@gmail.com', 'debbie', 'green', '+19514868019', 'DEBBIEJXER', 'ghl', 'C5ycwU5tXGJEWH7JEK5q', NULL, NULL, NULL, 'active', '2025-06-08 15:52:52.224+00', '2025-06-08 15:53:05.926+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.312158+00', '2025-06-11 12:29:56.382544+00');
INSERT INTO public.affiliate_system_users VALUES ('e8708b9d-03e3-4f5d-b4e4-47f2fd5e766e', 'surveysheather32@yahoo.con', 'heather', 'bell', NULL, 'HEATHERS1H', 'ghl', 'Ca6knO3m8fjjhibvgDFw', NULL, NULL, NULL, 'active', '2025-06-08 12:11:49.311+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.319405+00', '2025-06-11 12:29:56.391982+00');
INSERT INTO public.affiliate_system_users VALUES ('66f6084a-19be-4f05-af51-84418b357692', 'aafisher@twc.com', 'arlene', 'fisher', '+19804833211', 'ARLENEX0TG', 'ghl', 'epjZHjAA6EBg4lBI8QBk', NULL, NULL, NULL, 'active', '2025-06-07 22:49:25.619+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.326221+00', '2025-06-11 12:29:56.398464+00');
INSERT INTO public.affiliate_system_users VALUES ('073852e1-0071-49fd-906e-3a90b0e10f94', 'smcavoy.mastermarketer@gmail.com', 'scott', 'w.', NULL, 'SCOTTZMEN', 'ghl', 'IejUSggNnvcznXUjwHy0', NULL, NULL, NULL, 'active', '2025-06-07 14:09:04.587+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.333132+00', '2025-06-11 12:29:56.40544+00');
INSERT INTO public.affiliate_system_users VALUES ('3bfc2388-023f-4536-acc8-4e03d9db9f4b', 'mesparco@msn.com', 'ernest', 'parco', NULL, 'ERNEST0D9X', 'ghl', 'UeZnK4TQDi6p8GduPYKz', NULL, NULL, NULL, 'active', '2025-06-07 13:07:46.985+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.339983+00', '2025-06-11 12:29:56.412296+00');
INSERT INTO public.affiliate_system_users VALUES ('75650707-d66b-4e67-882e-ee39e5c90f13', 'officialjoyelliott@gmail.com', 'joy', 'elliott', '+15302772690', 'JOYTT6B', 'ghl', '4EV3QV8VbW9Epj3nvDj2', NULL, NULL, NULL, 'active', '2025-06-07 01:40:20.54+00', '2025-06-08 01:54:38.341+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.352691+00', '2025-06-11 12:29:56.427416+00');
INSERT INTO public.affiliate_system_users VALUES ('da52c45f-2ebb-4e10-8a8e-491cd845c90b', 'rochellebeachy79@gmail.com', 'rochelle', 'beachy', '+12707928386', 'ROCHEL2SPR', 'ghl', 'ymH5cFbWFklIRSJqSovO', NULL, NULL, NULL, 'active', '2025-06-07 01:03:59.501+00', '2025-06-10 16:36:24.995+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.359383+00', '2025-06-11 12:29:56.433917+00');
INSERT INTO public.affiliate_system_users VALUES ('aa287628-4c6c-47f9-9e90-e1ea23a3dc43', 'schaffatt1@gmail.com', 'stacyann', 'chaffatt', '+14049204806', 'STACYADH6B', 'ghl', 'xcFNHmgWfgmFuk1BXw6U', NULL, NULL, NULL, 'active', '2025-06-07 01:01:50.96+00', '2025-06-07 01:03:06.279+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.365502+00', '2025-06-11 12:29:56.440639+00');
INSERT INTO public.affiliate_system_users VALUES ('40b66165-a021-4c60-8ad2-9a74946826c6', 'jennifer.schaap8@gmail.com', 'jennifer', 'schaap', '+17195538125', 'JENNIF9KC6', 'ghl', '46kAk3kfvgygv0qKTQsT', NULL, NULL, NULL, 'active', '2025-06-07 00:59:44.268+00', '2025-06-07 00:59:59.492+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.373107+00', '2025-06-11 12:29:56.447752+00');
INSERT INTO public.affiliate_system_users VALUES ('20e27391-f5e6-476b-90e1-e8ce2e4a4069', 'lisanadine429@gmail.com', 'lisa', 'nadine', NULL, 'LISADGLT', 'ghl', 'gSD6ZCVu5EnkOspkCOvQ', NULL, NULL, NULL, 'active', '2025-06-06 22:10:07.644+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.379512+00', '2025-06-11 12:29:56.45501+00');
INSERT INTO public.affiliate_system_users VALUES ('12372592-4474-4451-8748-24a989dcebba', 'designsbypam58@gmail.com', 'pamela', 'arthur', '+12485204439', 'PAMELALBPN', 'ghl', '5WojepgQezidErMaVkzR', NULL, NULL, NULL, 'active', '2025-06-06 21:20:05.037+00', '2025-06-06 21:20:22.119+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.387117+00', '2025-06-11 12:29:56.462698+00');
INSERT INTO public.affiliate_system_users VALUES ('4e244dba-909c-4d17-9b98-6dfcc020ea0c', 'furo62@yahoo.com', 'ibifuro', 'william-jumbo', '+13013250641', 'IBIFURWFZS', 'ghl', 'O5vuik68Wl7UBSn06Lmy', NULL, NULL, NULL, 'active', '2025-06-06 21:13:12.779+00', '2025-06-06 21:13:25.763+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.394317+00', '2025-06-11 12:29:56.470633+00');
INSERT INTO public.affiliate_system_users VALUES ('928a8681-0e0b-4293-9dfc-80b4c759334d', 'kingmaker0786.mdc+1@gmail.com', 'vineet', 'kumar', '+919910073784', 'VINEETEX23', 'ghl', 'eh1nsgzAe50SdGK1E0Gu', NULL, NULL, NULL, 'active', '2025-06-06 21:09:43.969+00', '2025-06-06 21:09:59.092+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.400356+00', '2025-06-11 12:29:56.477642+00');
INSERT INTO public.affiliate_system_users VALUES ('0c9d171a-024f-4871-ace3-c4c234416514', 'mdsalati@icloud.com', 'michelle', 'salati', '+447510454911', 'MICHELD2S9', 'ghl', 'T2cYdDcKg5YdCQsRNh9W', NULL, NULL, NULL, 'active', '2025-06-06 21:02:04.213+00', '2025-06-06 21:02:44.547+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.407812+00', '2025-06-11 12:29:56.483956+00');
INSERT INTO public.affiliate_system_users VALUES ('16e0dcad-0360-49ec-aba0-f4a4d8dc5388', 'toddyoung22@gmail.com', 'todd', 'young', '+14434427281', 'TODDFVML', 'ghl', 'wvTEEk2aG7NDPEDELErO', NULL, NULL, NULL, 'active', '2025-06-06 20:56:01.73+00', '2025-06-06 20:56:25.91+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.413782+00', '2025-06-11 12:29:56.490582+00');
INSERT INTO public.affiliate_system_users VALUES ('2fc4fc3d-39be-43cd-ac10-b85c07171832', 'masterofmailboxmoney@pm.me', 'mick', 'jones', '+12145213030', 'MICKRDSB', 'ghl', 'A3mKfQSp3JFYNA0KFFnl', NULL, NULL, NULL, 'active', '2025-06-06 20:15:56.354+00', '2025-06-06 20:16:11.479+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.420112+00', '2025-06-11 12:29:56.496841+00');
INSERT INTO public.affiliate_system_users VALUES ('328d9c78-c841-45b1-9922-308dc07fce3f', 'henryalcala11@me.com', 'henry', 'alcala', NULL, 'HENRYBKOP', 'ghl', 'b38ifAK7SmSdXRqbCeYO', NULL, NULL, NULL, 'active', '2025-06-06 20:13:12.44+00', '2025-06-06 20:13:17.957+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.426473+00', '2025-06-11 12:29:56.50389+00');
INSERT INTO public.affiliate_system_users VALUES ('98fd276a-4c56-44f8-9855-90125ed0f127', '81urban81@gmail.com', 'henry', 'alcala', NULL, 'HENRY9QQ4', 'ghl', 'MrGrhUJo0bBPQvOs2txq', NULL, NULL, NULL, 'active', '2025-06-06 20:10:55.959+00', NULL, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.433005+00', '2025-06-11 12:29:56.510407+00');
INSERT INTO public.affiliate_system_users VALUES ('1cc2c34f-68a1-4af5-a8f6-806f9b1267f6', 'henryalcala1@me.com', 'henry', 'alcala', NULL, 'HENRYE20A', 'ghl', '0aXWUGNISwJi1QQsOEAB', NULL, NULL, NULL, 'active', '2025-06-06 18:28:54.766+00', '2025-06-06 18:29:11.024+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.439795+00', '2025-06-11 12:29:56.516716+00');
INSERT INTO public.affiliate_system_users VALUES ('e9662636-1240-4a1d-8374-3a6e47c68b80', 'no-reply@zoom.us', 'jenna', 'zwagil', NULL, 'JENNA15GU', 'ghl', '4uyDveqkBf9kA9otTAb0', NULL, NULL, NULL, 'active', '2025-06-06 18:24:16.126+00', '2025-06-06 19:41:23.911+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.445542+00', '2025-06-11 12:29:56.523637+00');
INSERT INTO public.affiliate_system_users VALUES ('d7793ef9-18a1-46fa-8b86-869d4e4f83bc', 'hempdragn@gmail.com', 'lisa', 'adragna', NULL, 'LISAT3SG', 'ghl', 'RrbJvgdLSfQyh9HSdKHz', NULL, NULL, NULL, 'active', '2025-06-06 18:16:14.782+00', '2025-06-06 18:16:29.954+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.451958+00', '2025-06-11 12:29:56.529942+00');
INSERT INTO public.affiliate_system_users VALUES ('de5ff934-5e11-4922-b7ed-da64679a2a41', 'hayleysdeals80@gmail.com', 'hayley', 'dobson', '+12709781108', 'HAYLEYWYM8', 'ghl', '1wn2G1rLp58yrSy9bTG2', NULL, NULL, NULL, 'active', '2025-06-06 18:16:04.693+00', '2025-06-06 18:16:22.583+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.458636+00', '2025-06-11 12:29:56.536483+00');
INSERT INTO public.affiliate_system_users VALUES ('f675e927-5946-405c-a706-08efdd23f6bc', 'daveh.1axis@gmail.com', 'dave', 'helms', '+17277234646', 'DAVE4SXW', 'ghl', 'fVrWxqQ6Hu08JZXL5p8H', NULL, NULL, NULL, 'active', '2025-06-06 18:00:01.942+00', '2025-06-06 18:01:02.546+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.464993+00', '2025-06-11 12:29:56.54311+00');
INSERT INTO public.affiliate_system_users VALUES ('2c87f26c-eb34-4e2b-a4e0-8e47e0eb5290', 'deewashington91@gmail.com', 'dee', 'washington', '+15402141908', 'DEE52LB', 'ghl', 'mtwRi63Eez61EVpIT6FB', NULL, NULL, NULL, 'active', '2025-06-06 17:40:50.578+00', '2025-06-06 17:41:06.745+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.471849+00', '2025-06-11 12:29:56.549582+00');
INSERT INTO public.affiliate_system_users VALUES ('2dfa3392-238d-44fe-8989-5099ca18160a', 'sweetmjshow@gmail.com', 'mary-jane', 'botha', '+27646832392', 'MARYJA0QA3', 'ghl', 'EZUyW4CsF8ZLUjqLsYSM', NULL, NULL, NULL, 'active', '2025-06-06 16:44:43.321+00', '2025-06-06 16:55:05.125+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.477791+00', '2025-06-11 12:29:56.556618+00');
INSERT INTO public.affiliate_system_users VALUES ('efab0499-98e6-4da4-b6ce-1f1a9f3aae68', 'pitawing@gmail.com', 'elnor', 'rollins', '+12544102553', 'ELNOR74EZ', 'ghl', 'zlKjcnga2QEL5IbTEjHQ', NULL, NULL, NULL, 'active', '2025-06-06 16:20:14.623+00', '2025-06-06 16:55:03.324+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.483824+00', '2025-06-11 12:29:56.562735+00');
INSERT INTO public.affiliate_system_users VALUES ('06cbf1b2-3ca2-4370-b049-7f58c57197d0', 'nessalynn7884@gmail.com', 'vanessa', 'meade', '+19792578739', 'VANESS21EZ', 'ghl', 'zBl2SqgXGKcuUnyjwUIA', NULL, NULL, NULL, 'active', '2025-06-06 16:11:16.887+00', '2025-06-06 16:55:05.125+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.490548+00', '2025-06-11 12:29:56.568836+00');
INSERT INTO public.affiliate_system_users VALUES ('b0a974ab-54fb-4a70-a497-1fc88db1b64a', 'dawnrbender@gmail.com', 'dawn', 'bender', NULL, 'DAWNUHTH', 'ghl', 'v8LjQOifXTmqEVfSU0rS', NULL, NULL, NULL, 'active', '2025-06-06 15:31:14.508+00', '2025-06-06 16:55:02.157+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.496966+00', '2025-06-11 12:29:56.575577+00');
INSERT INTO public.affiliate_system_users VALUES ('04d74253-bde4-40c7-bbce-0023d9560df8', 'spencerdhelms@gmail.com', 'spencer', 'helms', '+17274172659', 'SPENCENDGT', 'ghl', 'OCIMRwOEReEXql2hcGvK', NULL, NULL, NULL, 'active', '2025-06-06 15:14:31.09+00', '2025-06-06 16:55:03.744+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.511177+00', '2025-06-11 12:29:56.587523+00');
INSERT INTO public.affiliate_system_users VALUES ('f1329c7c-8b2d-431c-a03d-baf964900f47', 'andersonsteph2010@gmail.com', 'stephanie', 'anderson', '+13145411666', 'STEPHA2CWU', 'ghl', 'eKuFJIQ2o4tSxncg0Ry9', NULL, NULL, NULL, 'active', '2025-06-06 14:21:51.441+00', '2025-06-06 16:55:04.961+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.517291+00', '2025-06-11 12:29:56.59342+00');
INSERT INTO public.affiliate_system_users VALUES ('04c0ac84-c222-4d79-b2e8-295bbc9070ac', 'mdcamy@outlook.com', 'johnny', 'wang', '+14373406322', 'JOHNNY4XJQ', 'ghl', 'KOs54xTRiyvgHL2Xwm27', NULL, NULL, NULL, 'active', '2025-06-06 11:43:35.858+00', '2025-06-06 16:55:04.297+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.523639+00', '2025-06-11 12:29:56.599101+00');
INSERT INTO public.affiliate_system_users VALUES ('5ce4349f-b707-4952-829f-b56254458748', 'slimroastme@gmail.com', 'michelle', 'walton', '+12193086633', 'MICHEL0DG1', 'ghl', 'LJk8YMhyAZ9w3wajZPrD', NULL, NULL, NULL, 'active', '2025-06-06 15:24:36.498+00', '2025-06-06 16:55:03.492+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.504664+00', '2025-06-11 12:29:56.581212+00');
INSERT INTO public.affiliate_system_users VALUES ('ac5814f9-49d6-49ee-80b9-55eccd09e206', 'highlifemenopause@gmail.com', 'vanja', 'matahlija', '+385911715157', 'VANJAKVIC', 'ghl', 'Uu073OVn09lZ67qcYq2T', NULL, NULL, NULL, 'active', '2025-06-06 10:34:57.625+00', '2025-06-06 16:55:07.014+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.529801+00', '2025-06-11 12:29:56.606394+00');
INSERT INTO public.affiliate_system_users VALUES ('19f8b903-16f4-4d60-b5c0-3f92bf2c7c20', 'brayzen.project@gmail.com', 'william', 'bray', '+15012475189', 'WILLIAYVTH', 'ghl', 'AkImivPjjiHL33lia69b', NULL, NULL, NULL, 'active', '2025-06-06 03:49:14.279+00', '2025-06-06 16:55:04.879+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.561713+00', '2025-06-11 12:29:56.636876+00');
INSERT INTO public.affiliate_system_users VALUES ('6c4cb524-1bf8-47f0-88de-4ea592371a40', 'levami3067@endelite.com', 'jesting1', 'jesting2', NULL, 'JESTINAYM7', 'ghl', 'jhXGrv79Zxo1jPipNL05', NULL, NULL, NULL, 'active', '2025-06-05 22:05:41.979+00', '2025-06-08 22:06:40.49+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.59323+00', '2025-06-11 12:29:56.667723+00');
INSERT INTO public.affiliate_system_users VALUES ('ffa6b631-e413-4b8b-9a94-3ab831d1b558', 'arpitha.maria@istesting.app', 'test', 'ghl', NULL, 'TEST93HK', 'ghl', 'wOYq2vHWcLjSZ61q2l4a', NULL, NULL, NULL, 'active', '2025-06-05 19:52:12.029+00', '2025-06-05 21:23:39.294+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.624767+00', '2025-06-11 12:29:56.70126+00');
INSERT INTO public.affiliate_system_users VALUES ('c0b98639-dd40-4146-8a2e-22a6144cb96d', 'korenad824@endelite.com', NULL, NULL, NULL, 'KORENA3ON4', 'ghl', 'btRURNBpIVWTw7PWmzN7', NULL, NULL, NULL, 'active', '2025-06-05 16:40:54.472+00', '2025-06-05 16:40:55.717+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.666007+00', '2025-06-11 12:29:56.731364+00');
INSERT INTO public.affiliate_system_users VALUES ('1eb1b505-c836-4f5d-b966-9d7b00e6937a', 'bwellsmarketing@gmail.com', 'bruce', 'wells', '+17576603087', 'BRUCEHXCX', 'ghl', 'Axe1vLksxpcRXh5RdlrI', NULL, NULL, NULL, 'active', '2025-06-05 00:30:45.958+00', '2025-06-06 16:55:05.835+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.696892+00', '2025-06-11 12:29:56.762559+00');
INSERT INTO public.affiliate_system_users VALUES ('ee984dc3-994f-456b-8645-5a5062ce8bd0', 'esther@motiargaman.com', 'esther', 'ullrich', NULL, 'ESTHER8P4U', 'ghl', 'RnPZ7C8FWYbA8AM9kQPh', NULL, NULL, NULL, 'active', '2025-06-04 19:54:39.346+00', '2025-06-08 21:26:21.711+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.730837+00', '2025-06-11 12:29:56.793864+00');
INSERT INTO public.affiliate_system_users VALUES ('a1f2d1bb-2253-4730-8df9-bd4726055c7e', 'mugdha.mehta@gohighlevel.com', NULL, NULL, NULL, 'MUGDHAPBQL', 'ghl', 'QkmeUIAfp40rGIkDksEH', NULL, NULL, NULL, 'active', '2025-06-04 03:26:59.185+00', '2025-06-06 16:55:07.858+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.763432+00', '2025-06-11 12:29:56.826648+00');
INSERT INTO public.affiliate_system_users VALUES ('5df1e912-9dfb-488b-9cc7-c6557f276dac', 'kris.dagent@gmail.com', 'kristina', 'q', NULL, 'KRISTIE69A', 'ghl', 'n6G2GyxiT2ZJwRLoCbzz', NULL, NULL, NULL, 'active', '2025-06-03 11:41:46.415+00', '2025-06-07 02:56:18.358+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.794586+00', '2025-06-11 12:29:56.861297+00');
INSERT INTO public.affiliate_system_users VALUES ('60586041-282e-4963-a58a-3ad811a53228', 'sweedenhemp@gmail.com', 'jennifer', 'sweeden', '+18018913938', 'JENNIFOSUS', 'ghl', 'aoXDLmxIXFkfSRKcDydO', NULL, NULL, NULL, 'active', '2025-06-02 18:29:37.012+00', '2025-06-06 18:29:44.256+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.826333+00', '2025-06-11 12:29:56.892678+00');
INSERT INTO public.affiliate_system_users VALUES ('af398c8c-37ae-41c2-b228-3fda485dff4b', 'moremoney4all@yahoo.com', 'bernard', 'mellema', '+13602249342', 'BERNAR483H', 'ghl', 'PaCoM1kPji2q8Cz3ao6E', NULL, NULL, NULL, 'active', '2025-06-02 15:27:34.054+00', '2025-06-06 16:55:05.241+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.857034+00', '2025-06-11 12:29:56.923935+00');
INSERT INTO public.affiliate_system_users VALUES ('7b1c22d4-5ac5-47fa-a099-7f2fcc10a67a', 'cjames90210@gmail.com', 'curtis', 'james', '+13344511896', 'CURTISZ2IH', 'ghl', 'LMTtEIlZsHgyjVfz7ciZ', NULL, NULL, NULL, 'active', '2025-06-01 23:48:09.376+00', '2025-06-06 16:55:09.522+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.887654+00', '2025-06-11 12:29:56.954282+00');
INSERT INTO public.affiliate_system_users VALUES ('455450c2-7928-4cc3-a0ab-eca48f7d92a0', 'hoseath1@gmail.com', 'hosea', 'thornton', '+13092925848', 'HOSEAO34S', 'ghl', '9wAqSSMQmNnbY4XwWG0B', NULL, NULL, NULL, 'active', '2025-05-31 15:12:50.124+00', '2025-06-06 16:55:06.622+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.917123+00', '2025-06-11 12:29:56.983802+00');
INSERT INTO public.affiliate_system_users VALUES ('72d6cbcd-f36b-4b5f-9a01-0bb19f4d77db', 'binay.pathmaker@gmail.com', 'binay', 'kumar', '+919122293127', 'BINAYZWJV', 'ghl', 'W7c6GjtumGlJOrpRyVV7', NULL, NULL, NULL, 'active', '2025-06-06 10:32:25.166+00', '2025-06-06 16:55:05.393+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.536019+00', '2025-06-11 12:29:56.612462+00');
INSERT INTO public.affiliate_system_users VALUES ('f2091c86-e8b0-41a0-8d9d-21717a23446d', 'barbara.hope@ymail.com', 'barbara', 'hope', '+19032271954', 'BARBAR28UO', 'ghl', 'aOFgnG3jaZJW4r2sj13H', NULL, NULL, NULL, 'active', '2025-06-06 03:28:16.302+00', '2025-06-06 16:55:02.847+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.56827+00', '2025-06-11 12:29:56.643201+00');
INSERT INTO public.affiliate_system_users VALUES ('657bfccb-772c-4aa2-a12d-789ff0476f1c', 'niwegit350@endelite.com', 'jestesti', 'jess', NULL, 'JESTESRWLV', 'ghl', 't9EUro5JYFdW8oQiNRq3', NULL, NULL, NULL, 'active', '2025-06-05 21:56:08.097+00', '2025-06-08 21:58:47.155+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.5991+00', '2025-06-11 12:29:56.673844+00');
INSERT INTO public.affiliate_system_users VALUES ('18c5b11f-e9f6-4178-b798-b878921666cc', 'elodiawk@yahoo.com', 'elodia', 'kukla', '+15612718865', 'ELODIA0URJ', 'ghl', 'wDneOofOMNfieVHIRguc', NULL, NULL, NULL, 'active', '2025-06-05 18:58:30.58+00', '2025-06-06 16:55:04.193+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.630893+00', '2025-06-11 12:29:56.707575+00');
INSERT INTO public.affiliate_system_users VALUES ('0ba330c7-5561-4d78-b58d-b63fb7c2b649', 'daddyrich430@gmail.com', 'james', 'richard', '+14093325808', 'JAMESU7KH', 'ghl', 'osPXJN6ypuzZeOWFPPIi', NULL, NULL, NULL, 'active', '2025-06-05 16:09:05.252+00', '2025-06-06 16:55:03.574+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.672458+00', '2025-06-11 12:29:56.737872+00');
INSERT INTO public.affiliate_system_users VALUES ('36c449ed-b897-4a89-a369-aad86c992516', 'aimitan.cram@gmail.com', 'aimi', 'aimi', '+60149337688', 'AIMI0GX7', 'ghl', 'AJCtHgSaJDFwYa5wQOA0', NULL, NULL, NULL, 'active', '2025-06-04 22:18:50.425+00', '2025-06-08 22:18:56.44+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.704612+00', '2025-06-11 12:29:56.76844+00');
INSERT INTO public.affiliate_system_users VALUES ('ba9659bf-0104-4379-8452-7626185b797a', 'frderickgreen@gmail.com', 'frederick', 'green', '+19124297656', 'FREDER3HZI', 'ghl', '5jfevqQ9Z2dW4QRrnADS', NULL, NULL, NULL, 'active', '2025-06-04 12:33:49.87+00', '2025-06-08 12:33:56.709+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.737861+00', '2025-06-11 12:29:56.799504+00');
INSERT INTO public.affiliate_system_users VALUES ('62a9be2e-d6d1-462b-96d7-8510dcea1589', 'sherrystanley87@gmail.com', 'sherry', 'stanley', '+13175070629', 'SHERRY46E0', 'ghl', '3CkQcBBqgDpwRCQ3yEF9', NULL, NULL, NULL, 'active', '2025-06-03 23:37:06.184+00', '2025-06-07 02:56:20.458+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.769519+00', '2025-06-11 12:29:56.832852+00');
INSERT INTO public.affiliate_system_users VALUES ('2bbc197e-dd54-45e6-868f-e0b657823f96', 'cheryl_lovell2@yahoo.com', 'cheryl', 'lovell', '+12063131940', 'CHERYL07RH', 'ghl', 'gHlAnHlvWMnmz6lRvqJC', NULL, NULL, NULL, 'active', '2025-06-03 02:50:27.73+00', '2025-06-07 02:50:33.339+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.800373+00', '2025-06-11 12:29:56.866986+00');
INSERT INTO public.affiliate_system_users VALUES ('9882a6a0-3655-4fb4-8bac-4643aa50ab2f', 'myflex2500@gmail.com', 'zadreant', 'shelvin', NULL, 'ZADREA8E8L', 'ghl', 'Hw4SDP867CiPH2R1mRyh', NULL, NULL, NULL, 'active', '2025-06-02 18:29:14.364+00', '2025-06-06 18:29:28.184+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.83202+00', '2025-06-11 12:29:56.898907+00');
INSERT INTO public.affiliate_system_users VALUES ('b35ec649-ca5b-4246-8899-fa92a6674e35', 'migueltorresco@gmail.com', 'miguel', 'torres', '+14075342383', 'MIGUEL28NO', 'ghl', 'mVba0OSiuhnuTzVgX0AB', NULL, NULL, NULL, 'active', '2025-06-02 14:40:25.666+00', '2025-06-06 16:55:02.514+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.863002+00', '2025-06-11 12:29:56.929647+00');
INSERT INTO public.affiliate_system_users VALUES ('b5f64ae8-5bd6-4616-a8ba-5da474869348', 'epr623@gmail.com', 'ethel', 'robinson', '+13344129928', 'ETHELO54V', 'ghl', 'ZUL2Ey4FsPImSPvw8XsX', NULL, NULL, NULL, 'active', '2025-06-01 23:43:36.451+00', '2025-06-06 16:55:02.327+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.893392+00', '2025-06-11 12:29:56.960071+00');
INSERT INTO public.affiliate_system_users VALUES ('204ab2ea-015a-4175-9be3-b4096c63e983', 'sexanaf670@claspira.com', 'john', 'doe', NULL, 'JOHND61A', 'ghl', '8tgyZX1v2Op7wS5Vf9lJ', NULL, NULL, NULL, 'active', '2025-05-31 13:49:02.818+00', '2025-06-06 16:55:03.035+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.923555+00', '2025-06-11 12:29:56.990999+00');
INSERT INTO public.affiliate_system_users VALUES ('2b6a8acd-3bc3-4861-b104-afea80502416', 'stevendoe941@gmail.com', 'steve', 'doe', '+19417241962', 'STEVEQVC6', 'ghl', 'LHDf1jyI5X76UHt7ssTD', NULL, NULL, NULL, 'active', '2025-06-06 10:16:21.201+00', '2025-06-06 16:55:04.295+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.542571+00', '2025-06-11 12:29:56.618655+00');
INSERT INTO public.affiliate_system_users VALUES ('18728e99-a263-42c8-9f49-621b6fece93c', 'paughtiffany8@gmail.com', 'tiffany', 'paugh', '+18166392600', 'TIFFANLHF1', 'ghl', 'KuHMpZBBQ7zGX2pFixpE', NULL, NULL, NULL, 'active', '2025-06-06 02:05:14.404+00', '2025-06-06 16:55:04.457+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.574764+00', '2025-06-11 12:29:56.649258+00');
INSERT INTO public.affiliate_system_users VALUES ('05621688-27ad-46c7-9665-abdb4e7faed7', 'fixeh39685@eduhed.com', 'jesstest', 'subaffil', NULL, 'JESSTEX14B', 'ghl', 'alHNtUFMnwpGkiEHKjoA', NULL, NULL, NULL, 'active', '2025-06-05 21:25:55.794+00', '2025-06-08 21:33:25.388+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.605675+00', '2025-06-11 12:29:56.682839+00');
INSERT INTO public.affiliate_system_users VALUES ('69c616cc-1595-481b-882a-c7c29c4a345a', 'tradersbiz247@gmail.com', 'reuben', 'gutierrez', '+15623186050', 'REUBENZPLT', 'ghl', 'AEzSeejcGW2rVcegXuPX', NULL, NULL, NULL, 'active', '2025-06-05 18:02:12.438+00', '2025-06-06 16:55:02.707+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.640411+00', '2025-06-11 12:29:56.713627+00');
INSERT INTO public.affiliate_system_users VALUES ('435b5e6c-fe87-4864-bccc-ccb05ac9829e', 'david@davidgardner.life', 'david', 'gardner', '+18609664880', 'DAVID0PSP', 'ghl', 'hMM8tgAYOdBkIvq35w7O', NULL, NULL, NULL, 'active', '2025-06-05 11:26:08.751+00', '2025-06-06 16:55:05.399+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.678505+00', '2025-06-11 12:29:56.743955+00');
INSERT INTO public.affiliate_system_users VALUES ('63ed3a88-25de-42c4-a7e9-fc7a5d80b0c9', 'ldw067@gmail.com', 'lawrence', 'west', '+18109084408', 'LAWRENOYU9', 'ghl', 'gkakJjRdmpPbmWMAj6td', NULL, NULL, NULL, 'active', '2025-06-04 21:38:45.43+00', '2025-06-08 21:38:51.424+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.710937+00', '2025-06-11 12:29:56.774914+00');
INSERT INTO public.affiliate_system_users VALUES ('5cbd8779-49f5-436f-b1db-478d8bf7a3b5', 'coyis62582@claspira.com', 'qatesting', NULL, NULL, 'QATESTVUVX', 'ghl', 'o7p9jBmBUr1sCb1KJWvM', NULL, NULL, NULL, 'active', '2025-06-04 12:25:36.94+00', '2025-06-06 16:55:05.032+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.743708+00', '2025-06-11 12:29:56.805991+00');
INSERT INTO public.affiliate_system_users VALUES ('258e9695-4f9f-4d53-aff2-dd84849e59ee', 'reduke01@sbcglobal.net', 'magee', 'duke', '+19162083853', 'MAGEETWNQ', 'ghl', 'QWZ3SLSiBYr8GAn1eLrE', NULL, NULL, NULL, 'active', '2025-06-03 17:21:46.053+00', '2025-06-07 02:56:20.465+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.775953+00', '2025-06-11 12:29:56.839458+00');
INSERT INTO public.affiliate_system_users VALUES ('428a0280-4b7d-437b-9815-e3e3ad576538', 'barryelrod@gmail.com', 'barry', 'elrod', '+13123997101', 'BARRYLRO4', 'ghl', '3vvzKJ7YOVltJhyhb3Yu', NULL, NULL, NULL, 'active', '2025-06-02 23:09:14.964+00', '2025-06-06 23:09:21.114+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.807076+00', '2025-06-11 12:29:56.873541+00');
INSERT INTO public.affiliate_system_users VALUES ('919f5c46-4e59-4028-b971-53e88b3dd92c', 'tennisbum50@gmail.com', 'greg', 'galley', '+17725328806', 'GREGTO3Q', 'ghl', 'QtUdzMnpmFG5Uh1ZCpZ1', NULL, NULL, NULL, 'active', '2025-06-02 15:48:54.667+00', '2025-06-06 16:55:04.705+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.839012+00', '2025-06-11 12:29:56.905456+00');
INSERT INTO public.affiliate_system_users VALUES ('97e809fe-223d-4665-9077-89cdf54e9832', 'schuerpf@web.de', 'alois', 'schuerpf', '+41787260000', 'ALOISCROH', 'ghl', 'naPmk2p4kIvKQtaMYj8N', NULL, NULL, NULL, 'active', '2025-06-02 11:28:55.91+00', '2025-06-06 16:55:05.888+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.869236+00', '2025-06-11 12:29:56.936421+00');
INSERT INTO public.affiliate_system_users VALUES ('932de780-8076-4013-8665-295e1cbeeb2c', 'peaceoftheflower@gmail.com', 'victoria', 'geisler', '+16234663444', 'VICTOR7I8E', 'ghl', 'VJqwEmNYlKv5YVGHAT9d', NULL, NULL, NULL, 'active', '2025-06-01 22:00:45.504+00', '2025-06-06 22:03:03.822+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.899031+00', '2025-06-11 12:29:56.965983+00');
INSERT INTO public.affiliate_system_users VALUES ('1b19398b-a87b-410a-aa35-d4e342fe5e94', 'xaceko7255@eduhed.com', 'jessk', 'azxc', NULL, 'JESSK573M', 'ghl', 'sLlAnm95HHBxYSpCy0uK', NULL, NULL, NULL, 'active', '2025-05-31 03:43:04.611+00', '2025-06-06 16:55:03.281+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.929213+00', '2025-06-11 12:29:56.997404+00');
INSERT INTO public.affiliate_system_users VALUES ('9938e91d-5a21-4382-8aa4-e08b75954ad0', 'henryberjapay@gmail.com', 'bond', 'almaty', '+66657159259', 'BONDH2Q9', 'ghl', 'ot2DUEBebvAhGzNtsVxK', NULL, NULL, NULL, 'active', '2025-06-06 07:13:07.391+00', '2025-06-06 16:55:04.15+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.548432+00', '2025-06-11 12:29:56.624877+00');
INSERT INTO public.affiliate_system_users VALUES ('3504f508-90c4-4457-a1dc-08b3d0ef756d', 'heyckjay@gmail.com', 'catherine', 'johnson', '+14349071110', 'CATHERFCBO', 'ghl', '7jQbWuvMX9YR48aZMBZ5', NULL, NULL, NULL, 'active', '2025-06-06 01:57:05.124+00', '2025-06-06 16:55:08.328+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.58052+00', '2025-06-11 12:29:56.655656+00');
INSERT INTO public.affiliate_system_users VALUES ('94df03d7-6c7d-4426-958e-e99f82d645cc', 'anisha.girach@hotmail.co.uk', 'anisha', 'g', '+447427272262', 'ANISHAM913', 'ghl', 'zJBP4qwMGfHIW9STlGk2', NULL, NULL, NULL, 'active', '2025-06-05 20:13:33.287+00', '2025-06-06 16:55:02.719+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.611906+00', '2025-06-11 12:29:56.68921+00');
INSERT INTO public.affiliate_system_users VALUES ('cf9fff2b-3034-4813-8c75-ee2a4a611b64', 'taylor.shelton+1@gohighlevel.com', 'testing', 'testing', NULL, 'TESTINM1DD', 'ghl', 'SPnVRYqM75iBneocg9DE', NULL, NULL, NULL, 'active', '2025-06-05 17:47:18.425+00', '2025-06-08 17:48:10.435+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.65418+00', '2025-06-11 12:29:56.719686+00');
INSERT INTO public.affiliate_system_users VALUES ('3201e955-755d-49e2-8834-e32b7bb6870c', 'sunmoney1000@gmail.com', 'gyöngyvér', 'tunde', '+36202134700', 'GYNGYVZ1TS', 'ghl', '2oSYOREFoQsfFxOdQl8W', NULL, NULL, NULL, 'active', '2025-06-05 05:50:01.485+00', '2025-06-06 16:55:04.052+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.684202+00', '2025-06-11 12:29:56.749838+00');
INSERT INTO public.affiliate_system_users VALUES ('b5bca0d4-dfe0-464d-ad48-bde0ac9fb4a5', 'richardjgarcia75@gmail.com', 'richard', 'garcia', '+34678784359', 'RICHARS2KC', 'ghl', 'ffZPe5eiVYLpWBumlaa2', NULL, NULL, NULL, 'active', '2025-06-04 21:35:24.526+00', '2025-06-08 21:35:31.381+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.717234+00', '2025-06-11 12:29:56.781215+00');
INSERT INTO public.affiliate_system_users VALUES ('7781bc4d-334b-41c5-b94b-e27cb7dfb5e5', 'iamdeechosen1@gmail.com', 'dee', 'alexander', '+18883128999', 'DEEBLIY', 'ghl', 'hAk6MmxVtBO6st1lkPJo', NULL, NULL, NULL, 'active', '2025-06-04 12:21:00.258+00', '2025-06-08 12:21:06.179+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.750058+00', '2025-06-11 12:29:56.812492+00');
INSERT INTO public.affiliate_system_users VALUES ('c4e6c10f-5e8a-4618-bd89-387f999743b1', 'xavier.bobino@gmail.com', 'xavier', 'bobino', '+14093322023', 'XAVIERUUSN', 'ghl', '9XZwzkKu8IjTsYvhlGnl', NULL, NULL, NULL, 'active', '2025-06-03 14:43:06.563+00', '2025-06-07 02:56:20.441+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.782184+00', '2025-06-11 12:29:56.845805+00');
INSERT INTO public.affiliate_system_users VALUES ('feaeccb0-ac3f-4381-aa79-e698c6d7159f', 'beachsidemoney@gmail.com', 'jennifer', 'bradshaw', '+19493105344', 'JENNIFVU31', 'ghl', 'lg5sbUICeivzXsaGCLQP', NULL, NULL, NULL, 'active', '2025-06-02 19:41:22.768+00', '2025-06-06 19:41:30.539+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.813355+00', '2025-06-11 12:29:56.879703+00');
INSERT INTO public.affiliate_system_users VALUES ('739698dc-fdf7-45c6-8c00-855b05a969ff', 'jaydmartinez717@gmail.com', 'jay', 'martinez', '+13306071696', 'JAYK4YZ', 'ghl', 'Ez4etgkouD9i9mokuNuE', NULL, NULL, NULL, 'active', '2025-06-02 15:46:31.999+00', '2025-06-06 16:55:04.679+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.844998+00', '2025-06-11 12:29:56.910983+00');
INSERT INTO public.affiliate_system_users VALUES ('42e93ea3-44e2-4b43-b379-201e1e686be1', 'tegrisgroup@gmail.com', 'jon', 'nelson', '+16122502642', 'JON34JQ', 'ghl', 'E0VvsSpqiRYez3FMrUx8', NULL, NULL, NULL, 'active', '2025-06-02 01:41:39.684+00', '2025-06-06 16:55:04.146+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.875571+00', '2025-06-11 12:29:56.942262+00');
INSERT INTO public.affiliate_system_users VALUES ('54f61dae-05b0-4cfa-8375-c2867a6105f7', 'msbmwells@gmail.com', 'bernadette', 'wells', '+19196956053', 'BERNADPZAS', 'ghl', 'i2jdUEdxWdbjey8wgafm', NULL, NULL, NULL, 'active', '2025-06-01 01:56:31.708+00', '2025-06-06 16:55:04.903+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.905505+00', '2025-06-11 12:29:56.972457+00');
INSERT INTO public.affiliate_system_users VALUES ('4a402319-60cb-4907-9253-463f42ddf045', 'sage@risewith.us', 'Sage', 'Michael', NULL, 'SAMI4X2Z', 'manual', NULL, NULL, NULL, NULL, 'active', '2024-11-15 00:00:00+00', NULL, 5, 2, 1, 8, 455.00, 130.00, 65.00, 650.00, 130.00, 520.00, NULL, NULL, NULL, NULL, '2025-06-11 06:32:22.958923+00', '2025-06-11 06:32:22.958923+00');
INSERT INTO public.affiliate_system_users VALUES ('2a9966dd-d5aa-4e06-a1a4-e305bc4ee5dd', 'gugz_kandola@hotmail.co.uk', 'arvinder', 'kandola', '+447840397595', 'ARVINDJB1V', 'ghl', 'bV1RDsHfqVXRlp3nn5cc', NULL, NULL, NULL, 'active', '2025-06-07 02:37:38.424+00', '2025-06-07 02:39:14.396+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.346532+00', '2025-06-11 12:29:56.41995+00');
INSERT INTO public.affiliate_system_users VALUES ('e4cc4f90-4acd-4280-95b7-049eb889bb9e', 'chrisparis.protrader@gmail.com', 'chris', 'paris', '+18655670702', 'CHRISWC2G', 'ghl', 'ge6039c5WtAieRCkbsMe', NULL, NULL, NULL, 'active', '2025-06-06 06:53:30.89+00', '2025-06-06 16:55:04.309+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.555586+00', '2025-06-11 12:29:56.630652+00');
INSERT INTO public.affiliate_system_users VALUES ('78376133-d5da-4771-8dbc-b78ea541ca1c', 'ljbeukes@gmail.com', 'layton', 'beukes', '+27761265069', 'LAYTONJU5O', 'ghl', 'Ula6WQL0qRlpX31zhQr2', NULL, NULL, NULL, 'active', '2025-06-05 23:01:13.772+00', '2025-06-06 15:03:44.994+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.587379+00', '2025-06-11 12:29:56.661609+00');
INSERT INTO public.affiliate_system_users VALUES ('194507ea-59e1-47ab-a880-1aca529fbdd5', 'pslay320@gmail.com', 'pati', 'slay', '+13147170211', 'PATI3ESD', 'ghl', 'cjGpAOoRxThgeocjR4xf', NULL, NULL, NULL, 'active', '2025-06-05 20:03:51.751+00', '2025-06-06 16:55:03.244+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.618136+00', '2025-06-11 12:29:56.695293+00');
INSERT INTO public.affiliate_system_users VALUES ('11921f42-b914-4258-bd77-d067a3b52620', 'taylor.shelton@gohighlevel.com', 'test', 'affiliate', NULL, 'TESTK3SZ', 'ghl', 'NDJFnhbuPEstxkdcjK9w', NULL, NULL, NULL, 'active', '2025-06-05 17:30:05.978+00', '2025-06-08 17:31:30.217+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.660188+00', '2025-06-11 12:29:56.725563+00');
INSERT INTO public.affiliate_system_users VALUES ('d299b860-9f59-42d5-9446-fc7fdf461e61', 'strauberry31@msn.com', 'cindy', 'straub', '+15709169524', 'CINDYRNBC', 'ghl', 'Mt1oAf0b2qOcEB2AqAnf', NULL, NULL, NULL, 'active', '2025-06-05 02:54:45.307+00', '2025-06-06 16:55:08.31+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.690641+00', '2025-06-11 12:29:56.756681+00');
INSERT INTO public.affiliate_system_users VALUES ('f9bd7cac-29fa-4cf6-bc63-cfcfef0cc67d', 'battista.laffra@gmail.com', 'battista', 'laffranchi', '+393883475145', 'BATTISMS2G', 'ghl', '807MqeYaL38lAUDKH5qO', NULL, NULL, NULL, 'active', '2025-06-04 20:32:44.997+00', '2025-06-08 21:26:24.039+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.72375+00', '2025-06-11 12:29:56.787747+00');
INSERT INTO public.affiliate_system_users VALUES ('7a30bbbf-b0da-44de-86fa-8551a4414422', 'vtrainer@maitreyacorp.com', 'veronica', 'trainer', '+14403519221', 'VERONI8QNC', 'ghl', 'TQY6cbcfMWIghVOnBW41', NULL, NULL, NULL, 'active', '2025-06-04 11:53:11.507+00', '2025-06-08 11:53:19.512+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.757342+00', '2025-06-11 12:29:56.819962+00');
INSERT INTO public.affiliate_system_users VALUES ('c54bd921-b305-48f8-ab44-4cc42d98ccd8', 'njorogetina@gmail.com', 'tina', 'njoroge', '+353899591205', 'TINAZRW3', 'ghl', 'uJP2Ox2JUTOUNRchrk2y', NULL, NULL, NULL, 'active', '2025-06-03 12:33:40.783+00', '2025-06-07 02:56:18.223+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.788926+00', '2025-06-11 12:29:56.853721+00');
INSERT INTO public.affiliate_system_users VALUES ('81304c1e-ec73-4c92-a592-a575e00753fb', 'deelennon.biz@gmail.com', 'dee', 'lennon', NULL, 'DEEFQH1', 'ghl', 'nH3OixoOiZ2181GPbcoE', NULL, NULL, NULL, 'active', '2025-06-02 18:55:58.469+00', '2025-06-06 18:56:04.562+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.820492+00', '2025-06-11 12:29:56.886037+00');
INSERT INTO public.affiliate_system_users VALUES ('b038361b-7300-48b3-bfc8-65cf3480ad2c', 'tennisbim50@gmail.com', 'greg', 'galley', '+17725628806', 'GREGLX6G', 'ghl', 'gfocFahhymNddOMeHnCF', NULL, NULL, NULL, 'active', '2025-06-02 15:33:37.11+00', '2025-06-02 15:33:42.048+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.850603+00', '2025-06-11 12:29:56.916876+00');
INSERT INTO public.affiliate_system_users VALUES ('8d9a5ff1-9af5-41d1-af84-ddace4cf5d36', 'lindasworld@rocketmail.com', 'linda', 'ott', '+14404780928', 'LINDAZD1O', 'ghl', 'V2j7HsV8UXAzLMykgwK0', NULL, NULL, NULL, 'active', '2025-06-02 00:56:54.055+00', '2025-06-06 16:55:03.194+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.881217+00', '2025-06-11 12:29:56.948116+00');
INSERT INTO public.affiliate_system_users VALUES ('2dec46db-bfee-4de7-8c2a-58cca8493c2a', 'sonja.gerhards10@web.de', 'sonja', 'gerhards', NULL, 'SONJAOAC6', 'ghl', 'QGA9Ctukbct6UlB3AgdI', NULL, NULL, NULL, 'active', '2025-05-31 20:50:27.175+00', '2025-06-06 16:55:02.515+00', 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, '2025-06-11 06:02:08.911412+00', '2025-06-11 12:29:56.978269+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'ADMIN001', NULL, NULL, '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', true, 'test');
INSERT INTO public.users VALUES ('00000000-0000-0000-0000-000000000002', 'user1@example.com', 'Test User 1', 'USER001', NULL, NULL, '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', false, 'test');
INSERT INTO public.users VALUES ('00000000-0000-0000-0000-000000000003', 'user2@example.com', 'Test User 2', 'USER002', NULL, NULL, '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', false, 'test');


--
-- Data for Name: affiliates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.affiliates VALUES ('e535176b-fd45-470d-aac6-a2fb98e71eec', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 1, 10.00, 'active', '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.affiliates VALUES ('aa50b6b6-953e-4a85-a723-581ddcfe1c76', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 1, 10.00, 'active', '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', 'test');


--
-- Data for Name: clicks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clicks VALUES ('f6f5a3b5-2ab2-4d74-b14f-fc111cdd127c', '00000000-0000-0000-0000-000000000002', 'USER001', '192.168.1.1', 'Mozilla/5.0', 'clicked', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.clicks VALUES ('12cf5e25-efe0-4bcc-aa43-b16552e22139', '00000000-0000-0000-0000-000000000002', 'USER001', '192.168.1.2', 'Mozilla/5.0', 'converted', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.clicks VALUES ('b6161986-ceeb-43d8-a320-ce0997d00a96', '00000000-0000-0000-0000-000000000003', 'USER002', '192.168.1.3', 'Mozilla/5.0', 'clicked', '2025-06-11 05:47:18.461001+00', 'test');


--
-- Data for Name: commission_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commission_plans VALUES ('5db8a957-8cc5-462c-969f-2db578ed1bf0', 'bae', 'Bae', NULL, 20.00, 10.00, 5.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'Bae product commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('2bcf3d84-28ed-4f3b-87e0-067ed45f19bf', 'coaching_packs', 'Coaching Packs', NULL, 20.00, 10.00, 5.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'Coaching Packs commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('ef27df1f-b067-4b89-a722-2edecbe35e33', 'online_mastery', 'Online Mastery', NULL, 20.00, 10.00, 5.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'Online Mastery program commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('89c805c1-e743-4a1b-9f99-51dcbdbf4af7', 'bravo_fitness', 'BRAVO Fitness', NULL, 20.00, 10.00, 5.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'BRAVO Fitness commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('3104337b-5adc-47e3-bd60-e39e0f1ad5e0', 'ai_system', 'AI System', NULL, 20.00, 10.00, 5.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'AI System commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('f13b44d2-05b1-4fb9-83c4-1a9b9d05a26d', 'reaction_cbd', 'REACTION CBD', NULL, 15.00, 5.00, 5.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'REACTION CBD product commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('edfd4b31-9b98-43f1-8abf-34784eb9a595', 'events', 'EVENTS', NULL, 5.00, 2.50, 2.50, true, '2025-06-11 05:47:18.065838+00', NULL, 'Events commission structure', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');
INSERT INTO public.commission_plans VALUES ('b899513b-cfd7-4f52-9ee1-8951e193e253', 'default', 'Default Product', NULL, 15.00, 5.00, 2.00, true, '2025-06-11 05:47:18.065838+00', NULL, 'Default commission structure for uncategorized products', '2025-06-11 05:47:18.065838+00', '2025-06-11 05:47:18.065838+00');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transactions VALUES ('0311a5ca-6ec0-44f7-b5e3-8eec80adcb19', 'TRX001', '00000000-0000-0000-0000-000000000002', 'customer1@example.com', 100.00, 'Product 1', NULL, 'completed', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.transactions VALUES ('eae22283-438d-415e-b39c-f813170bc674', 'TRX002', '00000000-0000-0000-0000-000000000002', 'customer2@example.com', 150.00, 'Product 2', NULL, 'completed', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.transactions VALUES ('67bf4731-b461-490a-86e7-3ba67da8b59f', 'TRX003', '00000000-0000-0000-0000-000000000003', 'customer3@example.com', 200.00, 'Product 3', NULL, 'completed', '2025-06-11 05:47:18.461001+00', 'test');


--
-- Data for Name: commissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commissions VALUES ('6f81d677-abda-4d6e-8eb4-7b6efe141309', '0311a5ca-6ec0-44f7-b5e3-8eec80adcb19', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 1, 10.00, 10.00, 'paid', NULL, '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.commissions VALUES ('f48563cb-2985-4cc7-accc-e0fffdcc7088', 'eae22283-438d-415e-b39c-f813170bc674', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 1, 15.00, 10.00, 'paid', NULL, '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', 'test');
INSERT INTO public.commissions VALUES ('a318e6be-753f-4530-9107-abf57857a6b0', '67bf4731-b461-490a-86e7-3ba67da8b59f', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 1, 20.00, 10.00, 'paid', NULL, '2025-06-11 05:47:18.461001+00', '2025-06-11 05:47:18.461001+00', 'test');


--
-- Data for Name: data_import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.data_import_logs VALUES ('fd7b69da-c1a8-448d-a5a7-a012d4252742', 'affiliates', 'goaffpro', 'completed', 18, 18, 0, NULL, '2025-06-11 05:53:35.65861+00', '2025-06-11 05:53:36.107+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('0fef4378-3fee-496b-a571-eb29b58121c9', 'orders', 'goaffpro', 'completed', 4, 4, 0, NULL, '2025-06-11 05:53:36.125502+00', '2025-06-11 05:53:36.327+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('453ff4bf-90ad-4bce-9107-fa857f01be73', 'rewards', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 05:53:36.345713+00', '2025-06-11 05:53:36.53+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('5f5accb3-dcf4-4dcb-bb57-fd24b4e9674d', 'payments', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 05:53:36.55252+00', '2025-06-11 05:53:36.684+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('5b592e9f-fe73-4d11-9723-403da0025d50', 'affiliates', 'goaffpro', 'completed', 18, 18, 0, NULL, '2025-06-11 08:23:20.530705+00', '2025-06-11 08:23:20.93+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('94219ab2-8f4e-42bf-aa92-6d9d4dd29115', 'orders', 'goaffpro', 'completed', 4, 4, 0, NULL, '2025-06-11 08:23:20.94748+00', '2025-06-11 08:23:21.146+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('4bb6e31e-24af-4763-ba0d-fa8f02d81798', 'rewards', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 08:23:21.164338+00', '2025-06-11 08:23:21.411+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('62bd03fe-f4c9-45bc-b86b-43a2a35cee23', 'payments', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 08:23:21.435481+00', '2025-06-11 08:23:21.615+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('574c8390-3ebf-479e-93b8-e0251e0f8d3b', 'affiliates', 'goaffpro', 'completed', 18, 18, 0, NULL, '2025-06-11 09:14:50.404556+00', '2025-06-11 09:14:50.702+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('f5ae0cfe-9d49-46ad-9ed2-f36d8a08c621', 'orders', 'goaffpro', 'completed', 4, 4, 0, NULL, '2025-06-11 09:14:50.718622+00', '2025-06-11 09:14:50.903+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('1993ef41-6aa2-4b82-b566-375de3ff243b', 'rewards', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 09:14:50.921502+00', '2025-06-11 09:14:51.069+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('1d5007e4-bb91-45ec-8028-bde0f32abbba', 'payments', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 09:14:51.088322+00', '2025-06-11 09:14:51.275+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('b2e66094-33a8-4a93-b6db-03f9ffe2b761', 'affiliates', 'goaffpro', 'completed', 18, 18, 0, NULL, '2025-06-11 10:01:17.797264+00', '2025-06-11 10:01:18.147+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('12667e86-7a07-4f83-a992-1407439ccf9a', 'orders', 'goaffpro', 'completed', 4, 4, 0, NULL, '2025-06-11 10:01:18.164923+00', '2025-06-11 10:01:18.277+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('2097e9c1-62e9-4666-b64e-61ea20ab6101', 'rewards', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 10:01:18.293848+00', '2025-06-11 10:01:18.425+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('6898487e-eed3-479e-ba6b-db4686bbf58f', 'payments', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 10:01:18.448667+00', '2025-06-11 10:01:18.528+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('716b6db1-86ba-4ca8-bd28-0a24bcddfdeb', 'affiliates', 'goaffpro', 'completed', 18, 18, 0, NULL, '2025-06-11 11:37:43.493417+00', '2025-06-11 11:37:43.995+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('9c36fc4c-8019-4c49-aa9e-379c43ccd119', 'orders', 'goaffpro', 'completed', 4, 4, 0, NULL, '2025-06-11 11:37:44.014275+00', '2025-06-11 11:37:44.317+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('30e47f11-fd41-41f6-9e1a-541eaba8881e', 'rewards', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 11:37:44.337087+00', '2025-06-11 11:37:44.543+00', '00000000-0000-0000-0000-000000000001');
INSERT INTO public.data_import_logs VALUES ('577956f0-110b-428d-9d76-f8aa9b70b6a4', 'payments', 'goaffpro', 'completed', 0, 0, 0, NULL, '2025-06-11 11:37:44.566103+00', '2025-06-11 11:37:44.726+00', '00000000-0000-0000-0000-000000000001');


--
-- Data for Name: ghl_affiliates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ghl_affiliates VALUES ('1c3fd8ae-9b92-4c73-b361-c60a438d2ab6', 'epjZHjAA6EBg4lBI8QBk', 'aafisher@twc.com', 'arlene', 'fisher', '+19804833211', 'Main Site', '"[\"manifest-your-dreams\"]"', NULL, '2025-06-07 22:49:25.619+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.394+00', 'synced', '"{\"id\":\"epjZHjAA6EBg4lBI8QBk\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"arlene fisher\",\"firstName\":\"arlene\",\"lastName\":\"fisher\",\"companyName\":null,\"email\":\"aafisher@twc.com\",\"phone\":\"+19804833211\",\"dnd\":false,\"type\":\"lead\",\"source\":\"Main Site\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T22:49:25.619Z\",\"dateUpdated\":\"2025-06-07T22:52:45.312Z\",\"dateOfBirth\":null,\"tags\":[\"manifest-your-dreams\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"customField\":[]}"', '2025-06-11 11:36:29.706564+00', '2025-06-11 12:29:56.395252+00');
INSERT INTO public.ghl_affiliates VALUES ('ed3bf8fe-f88f-4d4a-8c4a-55c19c39399b', 'IejUSggNnvcznXUjwHy0', 'smcavoy.mastermarketer@gmail.com', 'scott', 'w.', NULL, NULL, '"[]"', NULL, '2025-06-07 14:09:04.587+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.4+00', 'synced', '"{\"id\":\"IejUSggNnvcznXUjwHy0\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"scott w.\",\"firstName\":\"scott\",\"lastName\":\"w.\",\"companyName\":null,\"email\":\"smcavoy.mastermarketer@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T14:09:04.587Z\",\"dateUpdated\":\"2025-06-07T14:09:11.480Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"customField\":[]}"', '2025-06-11 11:36:29.713761+00', '2025-06-11 12:29:56.401914+00');
INSERT INTO public.ghl_affiliates VALUES ('2670c3ae-b5d8-4510-9b0d-c8f8b318a2ec', 'UeZnK4TQDi6p8GduPYKz', 'mesparco@msn.com', 'ernest', 'parco', NULL, 'manifest your dreams', '"[\"manifest-your-dreams\"]"', NULL, '2025-06-07 13:07:46.985+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.407+00', 'synced', '"{\"id\":\"UeZnK4TQDi6p8GduPYKz\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"ernest parco\",\"firstName\":\"ernest\",\"lastName\":\"parco\",\"companyName\":null,\"email\":\"mesparco@msn.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"manifest your dreams\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T13:07:46.985Z\",\"dateUpdated\":\"2025-06-07T13:13:26.904Z\",\"dateOfBirth\":null,\"tags\":[\"manifest-your-dreams\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Manila\",\"customField\":[]}"', '2025-06-11 11:36:29.720236+00', '2025-06-11 12:29:56.409209+00');
INSERT INTO public.ghl_affiliates VALUES ('f4a7864e-b00c-45e6-bea9-c6765f3e2a98', '4EV3QV8VbW9Epj3nvDj2', 'officialjoyelliott@gmail.com', 'joy', 'elliott', '+15302772690', 'weekly wisdom', '"[\"purchase-3mastery\",\"manifest-your-dreams\"]"', NULL, '2025-06-07 01:40:20.54+00', '2025-06-08 01:54:38.341+00', NULL, NULL, 'active', '2025-06-11 12:29:56.422+00', 'synced', '"{\"id\":\"4EV3QV8VbW9Epj3nvDj2\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"joy elliott\",\"firstName\":\"joy\",\"lastName\":\"elliott\",\"companyName\":null,\"email\":\"officialjoyelliott@gmail.com\",\"phone\":\"+15302772690\",\"dnd\":false,\"type\":\"lead\",\"source\":\"weekly wisdom\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T01:40:20.540Z\",\"dateUpdated\":\"2025-06-08T16:12:19.954Z\",\"dateOfBirth\":null,\"tags\":[\"purchase-3mastery\",\"manifest-your-dreams\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749347678341,\"customField\":[]}"', '2025-06-11 11:36:29.734504+00', '2025-06-11 12:29:56.423322+00');
INSERT INTO public.ghl_affiliates VALUES ('56e28940-4944-4d20-affd-80b2c31069d6', 'MUzwGKGFwoK7kApiOf3N', 'klavionial0.23h@live.nl', 'kaila', 'lavio', '+212666622333', 'Main Site', '"[]"', NULL, '2025-06-09 19:11:57.486+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.332+00', 'synced', '"{\"id\":\"MUzwGKGFwoK7kApiOf3N\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"kaila lavio\",\"firstName\":\"kaila\",\"lastName\":\"lavio\",\"companyName\":null,\"email\":\"klavionial0.23h@live.nl\",\"phone\":\"+212666622333\",\"dnd\":false,\"type\":\"lead\",\"source\":\"Main Site\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-09T19:11:57.486Z\",\"dateUpdated\":\"2025-06-09T19:11:57.486Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Amsterdam\",\"customField\":[]}"', '2025-06-11 11:36:29.65831+00', '2025-06-11 12:29:56.344389+00');
INSERT INTO public.ghl_affiliates VALUES ('699345a0-0d2a-4fd7-8d90-263238402291', 'sUHJl88XoESl2T1AlCVf', 'adrian.danis@yahoo.com', 'adrian', 'danis', '+40721050368', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-09 12:02:17.993+00', '2025-06-09 12:03:58.358+00', NULL, NULL, 'active', '2025-06-11 12:29:56.357+00', 'synced', '"{\"id\":\"sUHJl88XoESl2T1AlCVf\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"adrian danis\",\"firstName\":\"adrian\",\"lastName\":\"danis\",\"companyName\":null,\"email\":\"adrian.danis@yahoo.com\",\"phone\":\"+40721050368\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-09T12:02:17.993Z\",\"dateUpdated\":\"2025-06-09T12:02:23.426Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Bucharest\",\"lastActivity\":1749470638358,\"customField\":[]}"', '2025-06-11 11:36:29.670489+00', '2025-06-11 12:29:56.358573+00');
INSERT INTO public.ghl_affiliates VALUES ('edd2e383-dc25-47a4-b22b-5e31bcbea60e', 'C5ycwU5tXGJEWH7JEK5q', 'ms.green.debbie@gmail.com', 'debbie', 'green', '+19514868019', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-08 15:52:52.224+00', '2025-06-08 15:53:05.926+00', NULL, NULL, 'active', '2025-06-11 12:29:56.377+00', 'synced', '"{\"id\":\"C5ycwU5tXGJEWH7JEK5q\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"debbie green\",\"firstName\":\"debbie\",\"lastName\":\"green\",\"companyName\":null,\"email\":\"ms.green.debbie@gmail.com\",\"phone\":\"+19514868019\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-08T15:52:52.224Z\",\"dateUpdated\":\"2025-06-08T15:52:56.117Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749397985926,\"customField\":[]}"', '2025-06-11 11:36:29.690078+00', '2025-06-11 12:29:56.378641+00');
INSERT INTO public.ghl_affiliates VALUES ('c4bc6349-0214-472d-bcfe-0569275a28d1', 'Ca6knO3m8fjjhibvgDFw', 'surveysheather32@yahoo.con', 'heather', 'bell', NULL, 'manifest your dreams', '"[\"manifest-your-dreams\"]"', NULL, '2025-06-08 12:11:49.311+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.387+00', 'synced', '"{\"id\":\"Ca6knO3m8fjjhibvgDFw\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"heather bell\",\"firstName\":\"heather\",\"lastName\":\"bell\",\"companyName\":null,\"email\":\"surveysheather32@yahoo.con\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"manifest your dreams\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-08T12:11:49.311Z\",\"dateUpdated\":\"2025-06-08T12:12:40.241Z\",\"dateOfBirth\":null,\"tags\":[\"manifest-your-dreams\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"customField\":[]}"', '2025-06-11 11:36:29.699193+00', '2025-06-11 12:29:56.388623+00');
INSERT INTO public.ghl_affiliates VALUES ('370ff3f0-637f-484d-9539-f909596f9b9d', '4uyDveqkBf9kA9otTAb0', 'no-reply@zoom.us', 'jenna', 'zwagil', NULL, NULL, '"[]"', NULL, '2025-06-06 18:24:16.126+00', '2025-06-06 19:41:23.911+00', NULL, NULL, 'active', '2025-06-11 12:29:56.519+00', 'synced', '"{\"id\":\"4uyDveqkBf9kA9otTAb0\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jenna zwagil\",\"firstName\":\"jenna\",\"lastName\":\"zwagil\",\"companyName\":null,\"email\":\"no-reply@zoom.us\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T18:24:16.126Z\",\"dateUpdated\":\"2025-06-06T19:41:23.847Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"lastActivity\":1749238883911,\"customField\":[]}"', '2025-06-11 11:36:29.831649+00', '2025-06-11 12:29:56.520463+00');
INSERT INTO public.ghl_affiliates VALUES ('7e517774-a0bc-4ebe-b016-02af4a3a5e88', 'EZUyW4CsF8ZLUjqLsYSM', 'sweetmjshow@gmail.com', 'mary-jane', 'botha', '+27646832392', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 16:44:43.321+00', '2025-06-06 16:55:05.125+00', NULL, NULL, 'active', '2025-06-11 12:29:56.551+00', 'synced', '"{\"id\":\"EZUyW4CsF8ZLUjqLsYSM\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"mary-jane botha\",\"firstName\":\"mary-jane\",\"lastName\":\"botha\",\"companyName\":null,\"email\":\"sweetmjshow@gmail.com\",\"phone\":\"+27646832392\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T16:44:43.321Z\",\"dateUpdated\":\"2025-06-06T20:12:31.081Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Africa/Johannesburg\",\"lastActivity\":1749228905125,\"customField\":[]}"', '2025-06-11 11:36:29.865625+00', '2025-06-11 12:29:56.553553+00');
INSERT INTO public.ghl_affiliates VALUES ('61bd6cbf-0742-4f24-b085-e5616e2515cc', 'OCIMRwOEReEXql2hcGvK', 'spencerdhelms@gmail.com', 'spencer', 'helms', '+17274172659', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 15:14:31.09+00', '2025-06-06 16:55:03.744+00', NULL, NULL, 'active', '2025-06-11 12:29:56.583+00', 'synced', '"{\"id\":\"OCIMRwOEReEXql2hcGvK\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"spencer helms\",\"firstName\":\"spencer\",\"lastName\":\"helms\",\"companyName\":null,\"email\":\"spencerdhelms@gmail.com\",\"phone\":\"+17274172659\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T15:14:31.090Z\",\"dateUpdated\":\"2025-06-06T15:50:28.142Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228903744,\"customField\":[]}"', '2025-06-11 11:36:29.896438+00', '2025-06-11 12:29:56.584162+00');
INSERT INTO public.ghl_affiliates VALUES ('3a1b7cf9-e778-43fe-addc-ba89dba3d2ac', 'LHDf1jyI5X76UHt7ssTD', 'stevendoe941@gmail.com', 'steve', 'doe', '+19417241962', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 10:16:21.201+00', '2025-06-06 16:55:04.295+00', NULL, NULL, 'active', '2025-06-11 12:29:56.614+00', 'synced', '"{\"id\":\"LHDf1jyI5X76UHt7ssTD\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"steve doe\",\"firstName\":\"steve\",\"lastName\":\"doe\",\"companyName\":null,\"email\":\"stevendoe941@gmail.com\",\"phone\":\"+19417241962\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T10:16:21.201Z\",\"dateUpdated\":\"2025-06-06T19:57:48.708Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228904295,\"customField\":[]}"', '2025-06-11 11:36:29.928109+00', '2025-06-11 12:29:56.615668+00');
INSERT INTO public.ghl_affiliates VALUES ('ded07a6d-0d5f-408f-a7e0-9f0e3e61ce33', 'KuHMpZBBQ7zGX2pFixpE', 'paughtiffany8@gmail.com', 'tiffany', 'paugh', '+18166392600', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 02:05:14.404+00', '2025-06-06 16:55:04.457+00', NULL, NULL, 'active', '2025-06-11 12:29:56.644+00', 'synced', '"{\"id\":\"KuHMpZBBQ7zGX2pFixpE\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"tiffany paugh\",\"firstName\":\"tiffany\",\"lastName\":\"paugh\",\"companyName\":null,\"email\":\"paughtiffany8@gmail.com\",\"phone\":\"+18166392600\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T02:05:14.404Z\",\"dateUpdated\":\"2025-06-06T02:05:17.822Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228904457,\"customField\":[]}"', '2025-06-11 11:36:29.959011+00', '2025-06-11 12:29:56.646301+00');
INSERT INTO public.ghl_affiliates VALUES ('3e480388-298e-44a8-ab5f-a7162f1173a6', 'alHNtUFMnwpGkiEHKjoA', 'fixeh39685@eduhed.com', 'jesstest', 'subaffil', NULL, NULL, '"[]"', NULL, '2025-06-05 21:25:55.794+00', '2025-06-08 21:33:25.388+00', NULL, NULL, 'active', '2025-06-11 12:29:56.676+00', 'synced', '"{\"id\":\"alHNtUFMnwpGkiEHKjoA\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jesstest subaffil\",\"firstName\":\"jesstest\",\"lastName\":\"subaffil\",\"companyName\":null,\"email\":\"fixeh39685@eduhed.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T21:25:55.794Z\",\"dateUpdated\":\"2025-06-05T21:25:57.901Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"lastActivity\":1749418405388,\"customField\":[]}"', '2025-06-11 11:36:29.989876+00', '2025-06-11 12:29:56.67751+00');
INSERT INTO public.ghl_affiliates VALUES ('fd4b8287-f2ff-4427-aa2c-f056b3e75abb', 'AEzSeejcGW2rVcegXuPX', 'tradersbiz247@gmail.com', 'reuben', 'gutierrez', '+15623186050', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 18:02:12.438+00', '2025-06-06 16:55:02.707+00', NULL, NULL, 'active', '2025-06-11 12:29:56.709+00', 'synced', '"{\"id\":\"AEzSeejcGW2rVcegXuPX\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"reuben gutierrez\",\"firstName\":\"reuben\",\"lastName\":\"gutierrez\",\"companyName\":null,\"email\":\"tradersbiz247@gmail.com\",\"phone\":\"+15623186050\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T18:02:12.438Z\",\"dateUpdated\":\"2025-06-06T17:40:48.336Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Los_Angeles\",\"lastActivity\":1749228902707,\"customField\":[]}"', '2025-06-11 11:36:30.020936+00', '2025-06-11 12:29:56.710521+00');
INSERT INTO public.ghl_affiliates VALUES ('6f38ebff-32a4-4132-a666-6cd54393efe9', 'gSD6ZCVu5EnkOspkCOvQ', 'lisanadine429@gmail.com', 'lisa', 'nadine', NULL, 'weekly wisdom', '"[]"', NULL, '2025-06-06 22:10:07.644+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.449+00', 'synced', '"{\"id\":\"gSD6ZCVu5EnkOspkCOvQ\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"lisa nadine\",\"firstName\":\"lisa\",\"lastName\":\"nadine\",\"companyName\":null,\"email\":\"lisanadine429@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"weekly wisdom\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T22:10:07.644Z\",\"dateUpdated\":\"2025-06-06T22:10:07.644Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Phoenix\",\"customField\":[]}"', '2025-06-11 11:36:29.761936+00', '2025-06-11 12:29:56.450835+00');
INSERT INTO public.ghl_affiliates VALUES ('85eda26b-a499-4c7d-8b1a-a777eb9bd69a', 'wvTEEk2aG7NDPEDELErO', 'toddyoung22@gmail.com', 'todd', 'young', '+14434427281', 'Main Site', '"[\"purchase-3mastery\"]"', NULL, '2025-06-06 20:56:01.73+00', '2025-06-06 20:56:25.91+00', NULL, NULL, 'active', '2025-06-11 12:29:56.486+00', 'synced', '"{\"id\":\"wvTEEk2aG7NDPEDELErO\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"todd young\",\"firstName\":\"todd\",\"lastName\":\"young\",\"companyName\":null,\"email\":\"toddyoung22@gmail.com\",\"phone\":\"+14434427281\",\"dnd\":false,\"type\":\"lead\",\"source\":\"Main Site\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T20:56:01.730Z\",\"dateUpdated\":\"2025-06-06T20:58:19.179Z\",\"dateOfBirth\":null,\"tags\":[\"purchase-3mastery\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749243385910,\"customField\":[]}"', '2025-06-11 11:36:29.796123+00', '2025-06-11 12:29:56.487652+00');
INSERT INTO public.ghl_affiliates VALUES ('b7583fee-f1d2-4834-a654-557d69e8e499', '1wn2G1rLp58yrSy9bTG2', 'hayleysdeals80@gmail.com', 'hayley', 'dobson', '+12709781108', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 18:16:04.693+00', '2025-06-06 18:16:22.583+00', NULL, NULL, 'active', '2025-06-11 12:29:56.531+00', 'synced', '"{\"id\":\"1wn2G1rLp58yrSy9bTG2\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"hayley dobson\",\"firstName\":\"hayley\",\"lastName\":\"dobson\",\"companyName\":null,\"email\":\"hayleysdeals80@gmail.com\",\"phone\":\"+12709781108\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T18:16:04.693Z\",\"dateUpdated\":\"2025-06-06T19:41:13.707Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749233782583,\"customField\":[]}"', '2025-06-11 11:36:29.845543+00', '2025-06-11 12:29:56.532863+00');
INSERT INTO public.ghl_affiliates VALUES ('7213fac6-0f64-4f3d-b675-a6fca80f668b', 'zBl2SqgXGKcuUnyjwUIA', 'nessalynn7884@gmail.com', 'vanessa', 'meade', '+19792578739', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 16:11:16.887+00', '2025-06-06 16:55:05.125+00', NULL, NULL, 'active', '2025-06-11 12:29:56.564+00', 'synced', '"{\"id\":\"zBl2SqgXGKcuUnyjwUIA\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"vanessa meade\",\"firstName\":\"vanessa\",\"lastName\":\"meade\",\"companyName\":null,\"email\":\"nessalynn7884@gmail.com\",\"phone\":\"+19792578739\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T16:11:16.887Z\",\"dateUpdated\":\"2025-06-06T19:59:58.086Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Denver\",\"lastActivity\":1749228905125,\"customField\":[]}"', '2025-06-11 11:36:29.87858+00', '2025-06-11 12:29:56.565804+00');
INSERT INTO public.ghl_affiliates VALUES ('3c0c316a-dda2-45ca-9ad4-f45f79c57df2', 'KOs54xTRiyvgHL2Xwm27', 'mdcamy@outlook.com', 'johnny', 'wang', '+14373406322', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 11:43:35.858+00', '2025-06-06 16:55:04.297+00', NULL, NULL, 'active', '2025-06-11 12:29:56.595+00', 'synced', '"{\"id\":\"KOs54xTRiyvgHL2Xwm27\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"johnny wang\",\"firstName\":\"johnny\",\"lastName\":\"wang\",\"companyName\":null,\"email\":\"mdcamy@outlook.com\",\"phone\":\"+14373406322\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T11:43:35.858Z\",\"dateUpdated\":\"2025-06-06T11:43:39.913Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Toronto\",\"lastActivity\":1749228904297,\"customField\":[]}"', '2025-06-11 11:36:29.908176+00', '2025-06-11 12:29:56.59622+00');
INSERT INTO public.ghl_affiliates VALUES ('4e88b876-254e-4551-854e-6455b767a035', 'ge6039c5WtAieRCkbsMe', 'chrisparis.protrader@gmail.com', 'chris', 'paris', '+18655670702', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 06:53:30.89+00', '2025-06-06 16:55:04.309+00', NULL, NULL, 'active', '2025-06-11 12:29:56.626+00', 'synced', '"{\"id\":\"ge6039c5WtAieRCkbsMe\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"chris paris\",\"firstName\":\"chris\",\"lastName\":\"paris\",\"companyName\":null,\"email\":\"chrisparis.protrader@gmail.com\",\"phone\":\"+18655670702\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T06:53:30.890Z\",\"dateUpdated\":\"2025-06-06T20:13:48.309Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228904309,\"customField\":[]}"', '2025-06-11 11:36:29.940051+00', '2025-06-11 12:29:56.627747+00');
INSERT INTO public.ghl_affiliates VALUES ('db0533d0-df17-4d03-9c83-b32951f52b52', 'Ula6WQL0qRlpX31zhQr2', 'ljbeukes@gmail.com', 'layton', 'beukes', '+27761265069', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 23:01:13.772+00', '2025-06-06 15:03:44.994+00', NULL, NULL, 'active', '2025-06-11 12:29:56.657+00', 'synced', '"{\"id\":\"Ula6WQL0qRlpX31zhQr2\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"layton beukes\",\"firstName\":\"layton\",\"lastName\":\"beukes\",\"companyName\":null,\"email\":\"ljbeukes@gmail.com\",\"phone\":\"+27761265069\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T23:01:13.772Z\",\"dateUpdated\":\"2025-06-05T23:01:28.704Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Africa/Johannesburg\",\"lastActivity\":1749222224994,\"customField\":[]}"', '2025-06-11 11:36:29.971046+00', '2025-06-11 12:29:56.658772+00');
INSERT INTO public.ghl_affiliates VALUES ('1c96c6f6-bd8b-4ca3-b8bf-0eb26fa385aa', 'cjGpAOoRxThgeocjR4xf', 'pslay320@gmail.com', 'pati', 'slay', '+13147170211', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 20:03:51.751+00', '2025-06-06 16:55:03.244+00', NULL, NULL, 'active', '2025-06-11 12:29:56.691+00', 'synced', '"{\"id\":\"cjGpAOoRxThgeocjR4xf\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"pati slay\",\"firstName\":\"pati\",\"lastName\":\"slay\",\"companyName\":null,\"email\":\"pslay320@gmail.com\",\"phone\":\"+13147170211\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T20:03:51.751Z\",\"dateUpdated\":\"2025-06-06T20:00:39.530Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228903244,\"customField\":[]}"', '2025-06-11 11:36:30.002419+00', '2025-06-11 12:29:56.692346+00');
INSERT INTO public.ghl_affiliates VALUES ('e0bd3ebb-23ce-4b3d-9929-846621014e55', 'NDJFnhbuPEstxkdcjK9w', 'taylor.shelton@gohighlevel.com', 'test', 'affiliate', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 17:30:05.978+00', '2025-06-08 17:31:30.217+00', NULL, NULL, 'active', '2025-06-11 12:29:56.721+00', 'synced', '"{\"id\":\"NDJFnhbuPEstxkdcjK9w\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"test affiliate\",\"firstName\":\"test\",\"lastName\":\"affiliate\",\"companyName\":null,\"email\":\"taylor.shelton@gohighlevel.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T17:30:05.978Z\",\"dateUpdated\":\"2025-06-05T17:30:09.900Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Calcutta\",\"lastActivity\":1749403890217,\"customField\":[]}"', '2025-06-11 11:36:30.033195+00', '2025-06-11 12:29:56.722621+00');
INSERT INTO public.ghl_affiliates VALUES ('6600b5bb-5ec0-4985-b3e8-68074237763c', 'O5vuik68Wl7UBSn06Lmy', 'furo62@yahoo.com', 'ibifuro', 'william-jumbo', '+13013250641', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 21:13:12.779+00', '2025-06-06 21:13:25.763+00', NULL, NULL, 'active', '2025-06-11 12:29:56.465+00', 'synced', '"{\"id\":\"O5vuik68Wl7UBSn06Lmy\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"ibifuro william-jumbo\",\"firstName\":\"ibifuro\",\"lastName\":\"william-jumbo\",\"companyName\":null,\"email\":\"furo62@yahoo.com\",\"phone\":\"+13013250641\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T21:13:12.779Z\",\"dateUpdated\":\"2025-06-06T21:13:16.672Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749244405763,\"customField\":[]}"', '2025-06-11 11:36:29.7762+00', '2025-06-11 12:29:56.466492+00');
INSERT INTO public.ghl_affiliates VALUES ('3a7f7158-d012-4991-bcbb-31dbe09d3b56', 'b38ifAK7SmSdXRqbCeYO', 'henryalcala11@me.com', 'henry', 'alcala', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 20:13:12.44+00', '2025-06-06 20:13:17.957+00', NULL, NULL, 'active', '2025-06-11 12:29:56.498+00', 'synced', '"{\"id\":\"b38ifAK7SmSdXRqbCeYO\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"henry alcala\",\"firstName\":\"henry\",\"lastName\":\"alcala\",\"companyName\":null,\"email\":\"henryalcala11@me.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T20:13:12.440Z\",\"dateUpdated\":\"2025-06-06T20:13:20.713Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Denver\",\"lastActivity\":1749240797957,\"customField\":[]}"', '2025-06-11 11:36:29.810247+00', '2025-06-11 12:29:56.500037+00');
INSERT INTO public.ghl_affiliates VALUES ('a6939eca-d12a-4abb-ae64-3ae1939042de', 'fVrWxqQ6Hu08JZXL5p8H', 'daveh.1axis@gmail.com', 'dave', 'helms', '+17277234646', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 18:00:01.942+00', '2025-06-06 18:01:02.546+00', NULL, NULL, 'active', '2025-06-11 12:29:56.538+00', 'synced', '"{\"id\":\"fVrWxqQ6Hu08JZXL5p8H\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"dave helms\",\"firstName\":\"dave\",\"lastName\":\"helms\",\"companyName\":null,\"email\":\"daveh.1axis@gmail.com\",\"phone\":\"+17277234646\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T18:00:01.942Z\",\"dateUpdated\":\"2025-06-06T18:02:36.123Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749232862546,\"customField\":[]}"', '2025-06-11 11:36:29.851949+00', '2025-06-11 12:29:56.53992+00');
INSERT INTO public.ghl_affiliates VALUES ('a96d7b07-68d5-4d1b-b5df-06e86be90450', 'v8LjQOifXTmqEVfSU0rS', 'dawnrbender@gmail.com', 'dawn', 'bender', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 15:31:14.508+00', '2025-06-06 16:55:02.157+00', NULL, NULL, 'active', '2025-06-11 12:29:56.57+00', 'synced', '"{\"id\":\"v8LjQOifXTmqEVfSU0rS\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"dawn bender\",\"firstName\":\"dawn\",\"lastName\":\"bender\",\"companyName\":null,\"email\":\"dawnrbender@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T15:31:14.508Z\",\"dateUpdated\":\"2025-06-06T15:31:18.873Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Los_Angeles\",\"lastActivity\":1749228902157,\"customField\":[]}"', '2025-06-11 11:36:29.88453+00', '2025-06-11 12:29:56.57231+00');
INSERT INTO public.ghl_affiliates VALUES ('dfe159d7-406d-4797-b264-20566a52b542', 'Uu073OVn09lZ67qcYq2T', 'highlifemenopause@gmail.com', 'vanja', 'matahlija', '+385911715157', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 10:34:57.625+00', '2025-06-06 16:55:07.014+00', NULL, NULL, 'active', '2025-06-11 12:29:56.601+00', 'synced', '"{\"id\":\"Uu073OVn09lZ67qcYq2T\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"vanja matahlija\",\"firstName\":\"vanja\",\"lastName\":\"matahlija\",\"companyName\":null,\"email\":\"highlifemenopause@gmail.com\",\"phone\":\"+385911715157\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T10:34:57.625Z\",\"dateUpdated\":\"2025-06-06T10:43:23.814Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Zagreb\",\"lastActivity\":1749228907014,\"customField\":[]}"', '2025-06-11 11:36:29.914607+00', '2025-06-11 12:29:56.603391+00');
INSERT INTO public.ghl_affiliates VALUES ('6152f6f3-dda5-471f-8db5-de124fb6cd92', 'AkImivPjjiHL33lia69b', 'brayzen.project@gmail.com', 'william', 'bray', '+15012475189', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 03:49:14.279+00', '2025-06-06 16:55:04.879+00', NULL, NULL, 'active', '2025-06-11 12:29:56.632+00', 'synced', '"{\"id\":\"AkImivPjjiHL33lia69b\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"william bray\",\"firstName\":\"william\",\"lastName\":\"bray\",\"companyName\":null,\"email\":\"brayzen.project@gmail.com\",\"phone\":\"+15012475189\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T03:49:14.279Z\",\"dateUpdated\":\"2025-06-06T03:49:18.892Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228904879,\"customField\":[]}"', '2025-06-11 11:36:29.946558+00', '2025-06-11 12:29:56.633442+00');
INSERT INTO public.ghl_affiliates VALUES ('293d5e3a-7246-4ff0-a680-56112ac7e4b8', 'jhXGrv79Zxo1jPipNL05', 'levami3067@endelite.com', 'jesting1', 'jesting2', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 22:05:41.979+00', '2025-06-08 22:06:40.49+00', NULL, NULL, 'active', '2025-06-11 12:29:56.663+00', 'synced', '"{\"id\":\"jhXGrv79Zxo1jPipNL05\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jesting1 jesting2\",\"firstName\":\"jesting1\",\"lastName\":\"jesting2\",\"companyName\":null,\"email\":\"levami3067@endelite.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T22:05:41.979Z\",\"dateUpdated\":\"2025-06-05T22:05:45.951Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Singapore\",\"lastActivity\":1749420400490,\"customField\":[]}"', '2025-06-11 11:36:29.977119+00', '2025-06-11 12:29:56.664663+00');
INSERT INTO public.ghl_affiliates VALUES ('7f34483a-1e4d-43c2-a983-1e4c8f798524', 'wOYq2vHWcLjSZ61q2l4a', 'arpitha.maria@istesting.app', 'test', 'ghl', NULL, NULL, '"[]"', NULL, '2025-06-05 19:52:12.029+00', '2025-06-05 21:23:39.294+00', NULL, NULL, 'active', '2025-06-11 12:29:56.697+00', 'synced', '"{\"id\":\"wOYq2vHWcLjSZ61q2l4a\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"test ghl\",\"firstName\":\"test\",\"lastName\":\"ghl\",\"companyName\":null,\"email\":\"arpitha.maria@istesting.app\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T19:52:12.029Z\",\"dateUpdated\":\"2025-06-05T19:54:48.730Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"lastActivity\":1749158619294,\"customField\":[]}"', '2025-06-11 11:36:30.0086+00', '2025-06-11 12:29:56.698205+00');
INSERT INTO public.ghl_affiliates VALUES ('dc55ffa6-e8f2-437e-9efd-90508c250e28', 'btRURNBpIVWTw7PWmzN7', 'korenad824@endelite.com', NULL, NULL, NULL, NULL, '"[]"', NULL, '2025-06-05 16:40:54.472+00', '2025-06-05 16:40:55.717+00', NULL, NULL, 'active', '2025-06-11 12:29:56.727+00', 'synced', '"{\"id\":\"btRURNBpIVWTw7PWmzN7\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"korenad824@endelite.com\",\"firstName\":null,\"lastName\":null,\"companyName\":null,\"email\":\"korenad824@endelite.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T16:40:54.472Z\",\"dateUpdated\":\"2025-06-05T16:40:54.472Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"lastActivity\":1749141655717,\"customField\":[]}"', '2025-06-11 11:36:30.038756+00', '2025-06-11 12:29:56.72839+00');
INSERT INTO public.ghl_affiliates VALUES ('6a4bfcf5-14b8-470e-bbfb-dc9c04b2f2f9', 'eh1nsgzAe50SdGK1E0Gu', 'kingmaker0786.mdc+1@gmail.com', 'vineet', 'kumar', '+919910073784', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 21:09:43.969+00', '2025-06-06 21:09:59.092+00', NULL, NULL, 'active', '2025-06-11 12:29:56.472+00', 'synced', '"{\"id\":\"eh1nsgzAe50SdGK1E0Gu\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"vineet kumar\",\"firstName\":\"vineet\",\"lastName\":\"kumar\",\"companyName\":null,\"email\":\"kingmaker0786.mdc+1@gmail.com\",\"phone\":\"+919910073784\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T21:09:43.969Z\",\"dateUpdated\":\"2025-06-06T21:09:48.029Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Calcutta\",\"lastActivity\":1749244199092,\"customField\":[]}"', '2025-06-11 11:36:29.782861+00', '2025-06-11 12:29:56.474128+00');
INSERT INTO public.ghl_affiliates VALUES ('361e1d53-c6a6-4af1-9107-3bb1fb85f075', 'MrGrhUJo0bBPQvOs2txq', '81urban81@gmail.com', 'henry', 'alcala', NULL, NULL, '"[]"', NULL, '2025-06-06 20:10:55.959+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.506+00', 'synced', '"{\"id\":\"MrGrhUJo0bBPQvOs2txq\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"henry alcala\",\"firstName\":\"henry\",\"lastName\":\"alcala\",\"companyName\":null,\"email\":\"81urban81@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T20:10:55.959Z\",\"dateUpdated\":\"2025-06-06T20:10:57.196Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"customField\":[]}"', '2025-06-11 11:36:29.816904+00', '2025-06-11 12:29:56.507189+00');
INSERT INTO public.ghl_affiliates VALUES ('dd97d8c2-e129-4d5f-b288-2fdc52e4edd8', 'mtwRi63Eez61EVpIT6FB', 'deewashington91@gmail.com', 'dee', 'washington', '+15402141908', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 17:40:50.578+00', '2025-06-06 17:41:06.745+00', NULL, NULL, 'active', '2025-06-11 12:29:56.545+00', 'synced', '"{\"id\":\"mtwRi63Eez61EVpIT6FB\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"dee washington\",\"firstName\":\"dee\",\"lastName\":\"washington\",\"companyName\":null,\"email\":\"deewashington91@gmail.com\",\"phone\":\"+15402141908\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T17:40:50.578Z\",\"dateUpdated\":\"2025-06-06T18:37:53.182Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749231666745,\"customField\":[]}"', '2025-06-11 11:36:29.858656+00', '2025-06-11 12:29:56.546227+00');
INSERT INTO public.ghl_affiliates VALUES ('17d47917-7441-4a51-b652-e79d31a15004', 'LJk8YMhyAZ9w3wajZPrD', 'slimroastme@gmail.com', 'michelle', 'walton', '+12193086633', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 15:24:36.498+00', '2025-06-06 16:55:03.492+00', NULL, NULL, 'active', '2025-06-11 12:29:56.577+00', 'synced', '"{\"id\":\"LJk8YMhyAZ9w3wajZPrD\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"michelle walton\",\"firstName\":\"michelle\",\"lastName\":\"walton\",\"companyName\":null,\"email\":\"slimroastme@gmail.com\",\"phone\":\"+12193086633\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T15:24:36.498Z\",\"dateUpdated\":\"2025-06-06T16:55:51.889Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228903492,\"customField\":[]}"', '2025-06-11 11:36:29.890499+00', '2025-06-11 12:29:56.578459+00');
INSERT INTO public.ghl_affiliates VALUES ('49f46d49-7aed-46b3-8b62-2af073eaa7c3', 'W7c6GjtumGlJOrpRyVV7', 'binay.pathmaker@gmail.com', 'binay', 'kumar', '+919122293127', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 10:32:25.166+00', '2025-06-06 16:55:05.393+00', NULL, NULL, 'active', '2025-06-11 12:29:56.608+00', 'synced', '"{\"id\":\"W7c6GjtumGlJOrpRyVV7\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"binay kumar\",\"firstName\":\"binay\",\"lastName\":\"kumar\",\"companyName\":null,\"email\":\"binay.pathmaker@gmail.com\",\"phone\":\"+919122293127\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T10:32:25.166Z\",\"dateUpdated\":\"2025-06-06T10:47:52.603Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Calcutta\",\"lastActivity\":1749228905393,\"customField\":[]}"', '2025-06-11 11:36:29.921004+00', '2025-06-11 12:29:56.609719+00');
INSERT INTO public.ghl_affiliates VALUES ('f78f58bc-0a48-42ae-8fd6-dca51aa632ba', 'aOFgnG3jaZJW4r2sj13H', 'barbara.hope@ymail.com', 'barbara', 'hope', '+19032271954', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 03:28:16.302+00', '2025-06-06 16:55:02.847+00', NULL, NULL, 'active', '2025-06-11 12:29:56.638+00', 'synced', '"{\"id\":\"aOFgnG3jaZJW4r2sj13H\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"barbara hope\",\"firstName\":\"barbara\",\"lastName\":\"hope\",\"companyName\":null,\"email\":\"barbara.hope@ymail.com\",\"phone\":\"+19032271954\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T03:28:16.302Z\",\"dateUpdated\":\"2025-06-06T17:38:43.752Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228902847,\"customField\":[]}"', '2025-06-11 11:36:29.95247+00', '2025-06-11 12:29:56.639702+00');
INSERT INTO public.ghl_affiliates VALUES ('3337198a-410d-4c3d-ab0f-ac9cf2c0ca75', 't9EUro5JYFdW8oQiNRq3', 'niwegit350@endelite.com', 'jestesti', 'jess', NULL, NULL, '"[]"', NULL, '2025-06-05 21:56:08.097+00', '2025-06-08 21:58:47.155+00', NULL, NULL, 'active', '2025-06-11 12:29:56.67+00', 'synced', '"{\"id\":\"t9EUro5JYFdW8oQiNRq3\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jestesti jess\",\"firstName\":\"jestesti\",\"lastName\":\"jess\",\"companyName\":null,\"email\":\"niwegit350@endelite.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T21:56:08.097Z\",\"dateUpdated\":\"2025-06-05T21:56:11.215Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"lastActivity\":1749419927155,\"customField\":[]}"', '2025-06-11 11:36:29.983097+00', '2025-06-11 12:29:56.67108+00');
INSERT INTO public.ghl_affiliates VALUES ('8bd07eaf-8f51-4934-99bc-40072e4b29c6', 'wDneOofOMNfieVHIRguc', 'elodiawk@yahoo.com', 'elodia', 'kukla', '+15612718865', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 18:58:30.58+00', '2025-06-06 16:55:04.193+00', NULL, NULL, 'active', '2025-06-11 12:29:56.703+00', 'synced', '"{\"id\":\"wDneOofOMNfieVHIRguc\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"elodia kukla\",\"firstName\":\"elodia\",\"lastName\":\"kukla\",\"companyName\":null,\"email\":\"elodiawk@yahoo.com\",\"phone\":\"+15612718865\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T18:58:30.580Z\",\"dateUpdated\":\"2025-06-05T18:58:34.204Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228904193,\"customField\":[]}"', '2025-06-11 11:36:30.014962+00', '2025-06-11 12:29:56.704771+00');
INSERT INTO public.ghl_affiliates VALUES ('d6b2a479-e537-4558-bee3-49526d316aae', 'osPXJN6ypuzZeOWFPPIi', 'daddyrich430@gmail.com', 'james', 'richard', '+14093325808', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 16:09:05.252+00', '2025-06-06 16:55:03.574+00', NULL, NULL, 'active', '2025-06-11 12:29:56.733+00', 'synced', '"{\"id\":\"osPXJN6ypuzZeOWFPPIi\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"james richard\",\"firstName\":\"james\",\"lastName\":\"richard\",\"companyName\":null,\"email\":\"daddyrich430@gmail.com\",\"phone\":\"+14093325808\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T16:09:05.252Z\",\"dateUpdated\":\"2025-06-05T16:09:09.506Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228903574,\"customField\":[]}"', '2025-06-11 11:36:30.044843+00', '2025-06-11 12:29:56.734783+00');
INSERT INTO public.ghl_affiliates VALUES ('cdb7604f-2f08-4c99-a089-dd09deb3c737', 'T2cYdDcKg5YdCQsRNh9W', 'mdsalati@icloud.com', 'michelle', 'salati', '+447510454911', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 21:02:04.213+00', '2025-06-06 21:02:44.547+00', NULL, NULL, 'active', '2025-06-11 12:29:56.479+00', 'synced', '"{\"id\":\"T2cYdDcKg5YdCQsRNh9W\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"michelle salati\",\"firstName\":\"michelle\",\"lastName\":\"salati\",\"companyName\":null,\"email\":\"mdsalati@icloud.com\",\"phone\":\"+447510454911\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T21:02:04.213Z\",\"dateUpdated\":\"2025-06-06T21:05:42.389Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/London\",\"lastActivity\":1749243764547,\"customField\":[]}"', '2025-06-11 11:36:29.78927+00', '2025-06-11 12:29:56.480911+00');
INSERT INTO public.ghl_affiliates VALUES ('8393653f-bef9-4077-8645-14f6616c6c69', '0aXWUGNISwJi1QQsOEAB', 'henryalcala1@me.com', 'henry', 'alcala', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 18:28:54.766+00', '2025-06-06 18:29:11.024+00', NULL, NULL, 'active', '2025-06-11 12:29:56.512+00', 'synced', '"{\"id\":\"0aXWUGNISwJi1QQsOEAB\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"henry alcala\",\"firstName\":\"henry\",\"lastName\":\"alcala\",\"companyName\":null,\"email\":\"henryalcala1@me.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T18:28:54.766Z\",\"dateUpdated\":\"2025-06-06T20:18:04.257Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Denver\",\"lastActivity\":1749234551024,\"customField\":[]}"', '2025-06-11 11:36:29.82397+00', '2025-06-11 12:29:56.513473+00');
INSERT INTO public.ghl_affiliates VALUES ('2e5d75aa-8e65-46d2-bd32-8c3cd8e24dfc', 'zlKjcnga2QEL5IbTEjHQ', 'pitawing@gmail.com', 'elnor', 'rollins', '+12544102553', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 16:20:14.623+00', '2025-06-06 16:55:03.324+00', NULL, NULL, 'active', '2025-06-11 12:29:56.558+00', 'synced', '"{\"id\":\"zlKjcnga2QEL5IbTEjHQ\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"elnor rollins\",\"firstName\":\"elnor\",\"lastName\":\"rollins\",\"companyName\":null,\"email\":\"pitawing@gmail.com\",\"phone\":\"+12544102553\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T16:20:14.623Z\",\"dateUpdated\":\"2025-06-06T17:11:26.724Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228903324,\"customField\":[]}"', '2025-06-11 11:36:29.872422+00', '2025-06-11 12:29:56.559985+00');
INSERT INTO public.ghl_affiliates VALUES ('b0ee75a9-1134-4d93-8048-066a8c6d5c14', 'eKuFJIQ2o4tSxncg0Ry9', 'andersonsteph2010@gmail.com', 'stephanie', 'anderson', '+13145411666', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 14:21:51.441+00', '2025-06-06 16:55:04.961+00', NULL, NULL, 'active', '2025-06-11 12:29:56.589+00', 'synced', '"{\"id\":\"eKuFJIQ2o4tSxncg0Ry9\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"stephanie anderson\",\"firstName\":\"stephanie\",\"lastName\":\"anderson\",\"companyName\":null,\"email\":\"andersonsteph2010@gmail.com\",\"phone\":\"+13145411666\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T14:21:51.441Z\",\"dateUpdated\":\"2025-06-06T20:07:53.228Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228904961,\"customField\":[]}"', '2025-06-11 11:36:29.902093+00', '2025-06-11 12:29:56.590345+00');
INSERT INTO public.ghl_affiliates VALUES ('76929b64-889f-4845-a80d-478c003dce21', 'ot2DUEBebvAhGzNtsVxK', 'henryberjapay@gmail.com', 'bond', 'almaty', '+66657159259', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 07:13:07.391+00', '2025-06-06 16:55:04.15+00', NULL, NULL, 'active', '2025-06-11 12:29:56.62+00', 'synced', '"{\"id\":\"ot2DUEBebvAhGzNtsVxK\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"bond almaty\",\"firstName\":\"bond\",\"lastName\":\"almaty\",\"companyName\":null,\"email\":\"henryberjapay@gmail.com\",\"phone\":\"+66657159259\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T07:13:07.391Z\",\"dateUpdated\":\"2025-06-06T20:03:36.923Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Bangkok\",\"lastActivity\":1749228904150,\"customField\":[]}"', '2025-06-11 11:36:29.934292+00', '2025-06-11 12:29:56.621697+00');
INSERT INTO public.ghl_affiliates VALUES ('6b4d05ba-6f1b-4307-bf37-ec479421f039', '7jQbWuvMX9YR48aZMBZ5', 'heyckjay@gmail.com', 'catherine', 'johnson', '+14349071110', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 01:57:05.124+00', '2025-06-06 16:55:08.328+00', NULL, NULL, 'active', '2025-06-11 12:29:56.651+00', 'synced', '"{\"id\":\"7jQbWuvMX9YR48aZMBZ5\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"catherine johnson\",\"firstName\":\"catherine\",\"lastName\":\"johnson\",\"companyName\":null,\"email\":\"heyckjay@gmail.com\",\"phone\":\"+14349071110\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T01:57:05.124Z\",\"dateUpdated\":\"2025-06-06T01:57:08.442Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228908328,\"customField\":[]}"', '2025-06-11 11:36:29.96508+00', '2025-06-11 12:29:56.652722+00');
INSERT INTO public.ghl_affiliates VALUES ('445c0c3d-a1d2-4e74-bcbb-a5b7c1d23b4b', 'zJBP4qwMGfHIW9STlGk2', 'anisha.girach@hotmail.co.uk', 'anisha', 'g', '+447427272262', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 20:13:33.287+00', '2025-06-06 16:55:02.719+00', NULL, NULL, 'active', '2025-06-11 12:29:56.684+00', 'synced', '"{\"id\":\"zJBP4qwMGfHIW9STlGk2\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"anisha g\",\"firstName\":\"anisha\",\"lastName\":\"g\",\"companyName\":null,\"email\":\"anisha.girach@hotmail.co.uk\",\"phone\":\"+447427272262\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T20:13:33.287Z\",\"dateUpdated\":\"2025-06-05T20:13:38.347Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/London\",\"lastActivity\":1749228902719,\"customField\":[]}"', '2025-06-11 11:36:29.996525+00', '2025-06-11 12:29:56.686269+00');
INSERT INTO public.ghl_affiliates VALUES ('12f1ab93-17d1-4f12-ac29-40b63a9f5f13', 'SPnVRYqM75iBneocg9DE', 'taylor.shelton+1@gohighlevel.com', 'testing', 'testing', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 17:47:18.425+00', '2025-06-08 17:48:10.435+00', NULL, NULL, 'active', '2025-06-11 12:29:56.715+00', 'synced', '"{\"id\":\"SPnVRYqM75iBneocg9DE\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"testing testing\",\"firstName\":\"testing\",\"lastName\":\"testing\",\"companyName\":null,\"email\":\"taylor.shelton+1@gohighlevel.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T17:47:18.425Z\",\"dateUpdated\":\"2025-06-05T17:47:22.835Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Calcutta\",\"lastActivity\":1749404890435,\"customField\":[]}"', '2025-06-11 11:36:30.027417+00', '2025-06-11 12:29:56.716556+00');
INSERT INTO public.ghl_affiliates VALUES ('04ecb5cc-fe97-440f-9b13-7d868d8b748f', '2oSYOREFoQsfFxOdQl8W', 'sunmoney1000@gmail.com', 'gyöngyvér', 'tunde', '+36202134700', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 05:50:01.485+00', '2025-06-06 16:55:04.052+00', NULL, NULL, 'active', '2025-06-11 12:29:56.746+00', 'synced', '"{\"id\":\"2oSYOREFoQsfFxOdQl8W\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"gyöngyvér tunde\",\"firstName\":\"gyöngyvér\",\"lastName\":\"tunde\",\"companyName\":null,\"email\":\"sunmoney1000@gmail.com\",\"phone\":\"+36202134700\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T05:50:01.485Z\",\"dateUpdated\":\"2025-06-05T05:50:04.831Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Budapest\",\"lastActivity\":1749228904052,\"customField\":[]}"', '2025-06-11 11:36:30.056766+00', '2025-06-11 12:29:56.747048+00');
INSERT INTO public.ghl_affiliates VALUES ('4f9e7633-3027-4796-b9da-211be99653e9', 'A3mKfQSp3JFYNA0KFFnl', 'masterofmailboxmoney@pm.me', 'mick', 'jones', '+12145213030', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 20:15:56.354+00', '2025-06-06 20:16:11.479+00', NULL, NULL, 'active', '2025-06-11 12:29:56.492+00', 'synced', '"{\"id\":\"A3mKfQSp3JFYNA0KFFnl\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"mick jones\",\"firstName\":\"mick\",\"lastName\":\"jones\",\"companyName\":null,\"email\":\"masterofmailboxmoney@pm.me\",\"phone\":\"+12145213030\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T20:15:56.354Z\",\"dateUpdated\":\"2025-06-06T20:21:29.452Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749240971479,\"customField\":[]}"', '2025-06-11 11:36:29.802871+00', '2025-06-11 12:29:56.493875+00');
INSERT INTO public.ghl_affiliates VALUES ('30f19d18-e38c-40b8-8d8c-db2176f80503', 'RrbJvgdLSfQyh9HSdKHz', 'hempdragn@gmail.com', 'lisa', 'adragna', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 18:16:14.782+00', '2025-06-06 18:16:29.954+00', NULL, NULL, 'active', '2025-06-11 12:29:56.525+00', 'synced', '"{\"id\":\"RrbJvgdLSfQyh9HSdKHz\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"lisa adragna\",\"firstName\":\"lisa\",\"lastName\":\"adragna\",\"companyName\":null,\"email\":\"hempdragn@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T18:16:14.782Z\",\"dateUpdated\":\"2025-06-06T20:00:40.577Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Phoenix\",\"lastActivity\":1749233789954,\"customField\":[]}"', '2025-06-11 11:36:29.838472+00', '2025-06-11 12:29:56.526762+00');
INSERT INTO public.ghl_affiliates VALUES ('c0cdab6d-e792-4f49-b8bf-17e791292e99', 'o7p9jBmBUr1sCb1KJWvM', 'coyis62582@claspira.com', 'qatesting', NULL, NULL, 'weekly wisdom', '"[]"', NULL, '2025-06-04 12:25:36.94+00', '2025-06-06 16:55:05.032+00', NULL, NULL, 'active', '2025-06-11 12:29:56.801+00', 'synced', '"{\"id\":\"o7p9jBmBUr1sCb1KJWvM\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"qatesting\",\"firstName\":\"qatesting\",\"lastName\":null,\"companyName\":null,\"email\":\"coyis62582@claspira.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"weekly wisdom\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T12:25:36.940Z\",\"dateUpdated\":\"2025-06-04T12:25:36.940Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Singapore\",\"lastActivity\":1749228905032,\"customField\":[]}"', '2025-06-11 11:36:30.111247+00', '2025-06-11 12:29:56.803192+00');
INSERT INTO public.ghl_affiliates VALUES ('d93d4ff5-2fb4-45d4-851b-5886460a46df', 'QWZ3SLSiBYr8GAn1eLrE', 'reduke01@sbcglobal.net', 'magee', 'duke', '+19162083853', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-03 17:21:46.053+00', '2025-06-07 02:56:20.465+00', NULL, NULL, 'active', '2025-06-11 12:29:56.834+00', 'synced', '"{\"id\":\"QWZ3SLSiBYr8GAn1eLrE\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"magee duke\",\"firstName\":\"magee\",\"lastName\":\"duke\",\"companyName\":null,\"email\":\"reduke01@sbcglobal.net\",\"phone\":\"+19162083853\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-03T17:21:46.053Z\",\"dateUpdated\":\"2025-06-06T13:45:20.471Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Los_Angeles\",\"lastActivity\":1749264980465,\"customField\":[]}"', '2025-06-11 11:36:30.141617+00', '2025-06-11 12:29:56.836549+00');
INSERT INTO public.ghl_affiliates VALUES ('4b94a4e1-f472-4a75-88f4-2c3bab7ff07c', '3vvzKJ7YOVltJhyhb3Yu', 'barryelrod@gmail.com', 'barry', 'elrod', '+13123997101', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 23:09:14.964+00', '2025-06-06 23:09:21.114+00', NULL, NULL, 'active', '2025-06-11 12:29:56.869+00', 'synced', '"{\"id\":\"3vvzKJ7YOVltJhyhb3Yu\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"barry elrod\",\"firstName\":\"barry\",\"lastName\":\"elrod\",\"companyName\":null,\"email\":\"barryelrod@gmail.com\",\"phone\":\"+13123997101\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T23:09:14.964Z\",\"dateUpdated\":\"2025-06-06T20:02:32.003Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749251361114,\"customField\":[]}"', '2025-06-11 11:36:30.17155+00', '2025-06-11 12:29:56.870584+00');
INSERT INTO public.ghl_affiliates VALUES ('0acf6b4b-a9af-424e-857a-9c4fb8573d68', 'QtUdzMnpmFG5Uh1ZCpZ1', 'tennisbum50@gmail.com', 'greg', 'galley', '+17725328806', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 15:48:54.667+00', '2025-06-06 16:55:04.705+00', NULL, NULL, 'active', '2025-06-11 12:29:56.9+00', 'synced', '"{\"id\":\"QtUdzMnpmFG5Uh1ZCpZ1\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"greg galley\",\"firstName\":\"greg\",\"lastName\":\"galley\",\"companyName\":null,\"email\":\"tennisbum50@gmail.com\",\"phone\":\"+17725328806\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T15:48:54.667Z\",\"dateUpdated\":\"2025-06-02T15:48:57.931Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228904705,\"customField\":[]}"', '2025-06-11 11:36:30.202246+00', '2025-06-11 12:29:56.902276+00');
INSERT INTO public.ghl_affiliates VALUES ('42e24276-a39e-4d47-85d6-5fdf7701e959', 'naPmk2p4kIvKQtaMYj8N', 'schuerpf@web.de', 'alois', 'schuerpf', '+41787260000', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 11:28:55.91+00', '2025-06-06 16:55:05.888+00', NULL, NULL, 'active', '2025-06-11 12:29:56.931+00', 'synced', '"{\"id\":\"naPmk2p4kIvKQtaMYj8N\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"alois schuerpf\",\"firstName\":\"alois\",\"lastName\":\"schuerpf\",\"companyName\":null,\"email\":\"schuerpf@web.de\",\"phone\":\"+41787260000\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T11:28:55.910Z\",\"dateUpdated\":\"2025-06-02T11:28:58.899Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Zurich\",\"lastActivity\":1749228905888,\"customField\":[]}"', '2025-06-11 11:36:30.233302+00', '2025-06-11 12:29:56.932793+00');
INSERT INTO public.ghl_affiliates VALUES ('e3a398f6-ccba-4a61-a2c7-aeed49384fe2', 'VJqwEmNYlKv5YVGHAT9d', 'peaceoftheflower@gmail.com', 'victoria', 'geisler', '+16234663444', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-01 22:00:45.504+00', '2025-06-06 22:03:03.822+00', NULL, NULL, 'active', '2025-06-11 12:29:56.961+00', 'synced', '"{\"id\":\"VJqwEmNYlKv5YVGHAT9d\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"victoria geisler\",\"firstName\":\"victoria\",\"lastName\":\"geisler\",\"companyName\":null,\"email\":\"peaceoftheflower@gmail.com\",\"phone\":\"+16234663444\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-01T22:00:45.504Z\",\"dateUpdated\":\"2025-06-05T22:02:57.975Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749247383822,\"customField\":[]}"', '2025-06-11 11:36:30.263216+00', '2025-06-11 12:29:56.96311+00');
INSERT INTO public.ghl_affiliates VALUES ('082a3b1b-e911-4aa0-a622-d089c193fab5', 'sLlAnm95HHBxYSpCy0uK', 'xaceko7255@eduhed.com', 'jessk', 'azxc', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-05-31 03:43:04.611+00', '2025-06-06 16:55:03.281+00', NULL, NULL, 'active', '2025-06-11 12:29:56.992+00', 'synced', '"{\"id\":\"sLlAnm95HHBxYSpCy0uK\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jessk azxc\",\"firstName\":\"jessk\",\"lastName\":\"azxc\",\"companyName\":null,\"email\":\"xaceko7255@eduhed.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-05-31T03:43:04.611Z\",\"dateUpdated\":\"2025-05-31T03:43:07.957Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Singapore\",\"lastActivity\":1749228903281,\"customField\":[]}"', '2025-06-11 11:36:30.293893+00', '2025-06-11 12:29:56.994649+00');
INSERT INTO public.ghl_affiliates VALUES ('665cc6fd-f19d-431d-ae77-aa7228c264f4', 'hMM8tgAYOdBkIvq35w7O', 'david@davidgardner.life', 'david', 'gardner', '+18609664880', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 11:26:08.751+00', '2025-06-06 16:55:05.399+00', NULL, NULL, 'active', '2025-06-11 12:29:56.739+00', 'synced', '"{\"id\":\"hMM8tgAYOdBkIvq35w7O\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"david gardner\",\"firstName\":\"david\",\"lastName\":\"gardner\",\"companyName\":null,\"email\":\"david@davidgardner.life\",\"phone\":\"+18609664880\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T11:26:08.751Z\",\"dateUpdated\":\"2025-06-06T19:22:57.604Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228905399,\"customField\":[]}"', '2025-06-11 11:36:30.050507+00', '2025-06-11 12:29:56.740963+00');
INSERT INTO public.ghl_affiliates VALUES ('ba2ed3f3-53aa-4308-a4c1-d8c564623ed1', 'gkakJjRdmpPbmWMAj6td', 'ldw067@gmail.com', 'lawrence', 'west', '+18109084408', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 21:38:45.43+00', '2025-06-08 21:38:51.424+00', NULL, NULL, 'active', '2025-06-11 12:29:56.77+00', 'synced', '"{\"id\":\"gkakJjRdmpPbmWMAj6td\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"lawrence west\",\"firstName\":\"lawrence\",\"lastName\":\"west\",\"companyName\":null,\"email\":\"ldw067@gmail.com\",\"phone\":\"+18109084408\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T21:38:45.430Z\",\"dateUpdated\":\"2025-06-06T16:57:43.580Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749418731424,\"customField\":[]}"', '2025-06-11 11:36:30.081518+00', '2025-06-11 12:29:56.77161+00');
INSERT INTO public.ghl_affiliates VALUES ('df7979ef-f485-43f2-910a-e8f3c1f8bb17', 'nH3OixoOiZ2181GPbcoE', 'deelennon.biz@gmail.com', 'dee', 'lennon', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 18:55:58.469+00', '2025-06-06 18:56:04.562+00', NULL, NULL, 'active', '2025-06-11 12:29:56.881+00', 'synced', '"{\"id\":\"nH3OixoOiZ2181GPbcoE\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"dee lennon\",\"firstName\":\"dee\",\"lastName\":\"lennon\",\"companyName\":null,\"email\":\"deelennon.biz@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T18:55:58.469Z\",\"dateUpdated\":\"2025-06-06T17:05:58.551Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Dublin\",\"lastActivity\":1749236164562,\"customField\":[]}"', '2025-06-11 11:36:30.18407+00', '2025-06-11 12:29:56.88275+00');
INSERT INTO public.ghl_affiliates VALUES ('c658f536-4471-4c80-82e9-ca463f4cf4d1', 'gfocFahhymNddOMeHnCF', 'tennisbim50@gmail.com', 'greg', 'galley', '+17725628806', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 15:33:37.11+00', '2025-06-02 15:33:42.048+00', NULL, NULL, 'active', '2025-06-11 12:29:56.912+00', 'synced', '"{\"id\":\"gfocFahhymNddOMeHnCF\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"greg galley\",\"firstName\":\"greg\",\"lastName\":\"galley\",\"companyName\":null,\"email\":\"tennisbim50@gmail.com\",\"phone\":\"+17725628806\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T15:33:37.110Z\",\"dateUpdated\":\"2025-06-02T15:33:43.524Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1748878422048,\"customField\":[]}"', '2025-06-11 11:36:30.215195+00', '2025-06-11 12:29:56.913811+00');
INSERT INTO public.ghl_affiliates VALUES ('f80b9040-4bf7-4d75-9765-d4f6025d1727', 'V2j7HsV8UXAzLMykgwK0', 'lindasworld@rocketmail.com', 'linda', 'ott', '+14404780928', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 00:56:54.055+00', '2025-06-06 16:55:03.194+00', NULL, NULL, 'active', '2025-06-11 12:29:56.944+00', 'synced', '"{\"id\":\"V2j7HsV8UXAzLMykgwK0\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"linda ott\",\"firstName\":\"linda\",\"lastName\":\"ott\",\"companyName\":null,\"email\":\"lindasworld@rocketmail.com\",\"phone\":\"+14404780928\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T00:56:54.055Z\",\"dateUpdated\":\"2025-06-06T16:59:30.176Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228903194,\"customField\":[]}"', '2025-06-11 11:36:30.245503+00', '2025-06-11 12:29:56.945068+00');
INSERT INTO public.ghl_affiliates VALUES ('540cb136-2e3e-49c1-a414-71160d4ecf4a', 'QGA9Ctukbct6UlB3AgdI', 'sonja.gerhards10@web.de', 'sonja', 'gerhards', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-05-31 20:50:27.175+00', '2025-06-06 16:55:02.515+00', NULL, NULL, 'active', '2025-06-11 12:29:56.974+00', 'synced', '"{\"id\":\"QGA9Ctukbct6UlB3AgdI\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"sonja gerhards\",\"firstName\":\"sonja\",\"lastName\":\"gerhards\",\"companyName\":null,\"email\":\"sonja.gerhards10@web.de\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-05-31T20:50:27.175Z\",\"dateUpdated\":\"2025-06-06T21:58:21.111Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Berlin\",\"lastActivity\":1749228902515,\"customField\":[]}"', '2025-06-11 11:36:30.27509+00', '2025-06-11 12:29:56.975311+00');
INSERT INTO public.ghl_affiliates VALUES ('67ec461a-e8d5-4ad1-ba43-bf4fad4c7a9d', 'Mt1oAf0b2qOcEB2AqAnf', 'strauberry31@msn.com', 'cindy', 'straub', '+15709169524', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 02:54:45.307+00', '2025-06-06 16:55:08.31+00', NULL, NULL, 'active', '2025-06-11 12:29:56.751+00', 'synced', '"{\"id\":\"Mt1oAf0b2qOcEB2AqAnf\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"cindy straub\",\"firstName\":\"cindy\",\"lastName\":\"straub\",\"companyName\":null,\"email\":\"strauberry31@msn.com\",\"phone\":\"+15709169524\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T02:54:45.307Z\",\"dateUpdated\":\"2025-06-05T02:54:48.389Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228908310,\"customField\":[]}"', '2025-06-11 11:36:30.062789+00', '2025-06-11 12:29:56.753334+00');
INSERT INTO public.ghl_affiliates VALUES ('74ede016-26f6-4216-b679-3065f0f59458', '807MqeYaL38lAUDKH5qO', 'battista.laffra@gmail.com', 'battista', 'laffranchi', '+393883475145', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 20:32:44.997+00', '2025-06-08 21:26:24.039+00', NULL, NULL, 'active', '2025-06-11 12:29:56.783+00', 'synced', '"{\"id\":\"807MqeYaL38lAUDKH5qO\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"battista laffranchi\",\"firstName\":\"battista\",\"lastName\":\"laffranchi\",\"companyName\":null,\"email\":\"battista.laffra@gmail.com\",\"phone\":\"+393883475145\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T20:32:44.997Z\",\"dateUpdated\":\"2025-06-04T20:32:48.304Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Rome\",\"lastActivity\":1749417984039,\"customField\":[]}"', '2025-06-11 11:36:30.093532+00', '2025-06-11 12:29:56.784272+00');
INSERT INTO public.ghl_affiliates VALUES ('83bc8118-f52a-44b1-9846-3c55e754af4f', 'TQY6cbcfMWIghVOnBW41', 'vtrainer@maitreyacorp.com', 'veronica', 'trainer', '+14403519221', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 11:53:11.507+00', '2025-06-08 11:53:19.512+00', NULL, NULL, 'active', '2025-06-11 12:29:56.815+00', 'synced', '"{\"id\":\"TQY6cbcfMWIghVOnBW41\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"veronica trainer\",\"firstName\":\"veronica\",\"lastName\":\"trainer\",\"companyName\":null,\"email\":\"vtrainer@maitreyacorp.com\",\"phone\":\"+14403519221\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T11:53:11.507Z\",\"dateUpdated\":\"2025-06-04T11:53:14.840Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749383599512,\"customField\":[]}"', '2025-06-11 11:36:30.12379+00', '2025-06-11 12:29:56.816316+00');
INSERT INTO public.ghl_affiliates VALUES ('b847a3b2-53d4-4963-ae29-e4f81a45f39d', 'uJP2Ox2JUTOUNRchrk2y', 'njorogetina@gmail.com', 'tina', 'njoroge', '+353899591205', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-03 12:33:40.783+00', '2025-06-07 02:56:18.223+00', NULL, NULL, 'active', '2025-06-11 12:29:56.847+00', 'synced', '"{\"id\":\"uJP2Ox2JUTOUNRchrk2y\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"tina njoroge\",\"firstName\":\"tina\",\"lastName\":\"njoroge\",\"companyName\":null,\"email\":\"njorogetina@gmail.com\",\"phone\":\"+353899591205\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-03T12:33:40.783Z\",\"dateUpdated\":\"2025-06-05T20:29:32.942Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Dublin\",\"lastActivity\":1749264978223,\"customField\":[]}"', '2025-06-11 11:36:30.152891+00', '2025-06-11 12:29:56.848902+00');
INSERT INTO public.ghl_affiliates VALUES ('028782e8-7697-492b-8d21-a5a73486ca3c', 'aoXDLmxIXFkfSRKcDydO', 'sweedenhemp@gmail.com', 'jennifer', 'sweeden', '+18018913938', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 18:29:37.012+00', '2025-06-06 18:29:44.256+00', NULL, NULL, 'active', '2025-06-11 12:29:56.888+00', 'synced', '"{\"id\":\"aoXDLmxIXFkfSRKcDydO\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jennifer sweeden\",\"firstName\":\"jennifer\",\"lastName\":\"sweeden\",\"companyName\":null,\"email\":\"sweedenhemp@gmail.com\",\"phone\":\"+18018913938\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T18:29:37.012Z\",\"dateUpdated\":\"2025-06-02T18:29:40.471Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Denver\",\"lastActivity\":1749234584256,\"customField\":[]}"', '2025-06-11 11:36:30.189927+00', '2025-06-11 12:29:56.889779+00');
INSERT INTO public.ghl_affiliates VALUES ('c74a0fc4-5cb9-4e02-84b8-5668165a6ea9', 'PaCoM1kPji2q8Cz3ao6E', 'moremoney4all@yahoo.com', 'bernard', 'mellema', '+13602249342', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 15:27:34.054+00', '2025-06-06 16:55:05.241+00', NULL, NULL, 'active', '2025-06-11 12:29:56.919+00', 'synced', '"{\"id\":\"PaCoM1kPji2q8Cz3ao6E\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"bernard mellema\",\"firstName\":\"bernard\",\"lastName\":\"mellema\",\"companyName\":null,\"email\":\"moremoney4all@yahoo.com\",\"phone\":\"+13602249342\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T15:27:34.054Z\",\"dateUpdated\":\"2025-06-02T15:27:38.976Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Los_Angeles\",\"lastActivity\":1749228905241,\"customField\":[]}"', '2025-06-11 11:36:30.221135+00', '2025-06-11 12:29:56.920913+00');
INSERT INTO public.ghl_affiliates VALUES ('1040386c-f111-4344-aed0-e7e4e1c510a5', 'LMTtEIlZsHgyjVfz7ciZ', 'cjames90210@gmail.com', 'curtis', 'james', '+13344511896', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-01 23:48:09.376+00', '2025-06-06 16:55:09.522+00', NULL, NULL, 'active', '2025-06-11 12:29:56.949+00', 'synced', '"{\"id\":\"LMTtEIlZsHgyjVfz7ciZ\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"curtis james\",\"firstName\":\"curtis\",\"lastName\":\"james\",\"companyName\":null,\"email\":\"cjames90210@gmail.com\",\"phone\":\"+13344511896\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-01T23:48:09.376Z\",\"dateUpdated\":\"2025-06-06T12:34:07.562Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228909522,\"customField\":[]}"', '2025-06-11 11:36:30.251001+00', '2025-06-11 12:29:56.950996+00');
INSERT INTO public.ghl_affiliates VALUES ('79d7888f-25c3-443b-a560-e3a4a67a8ac9', '9wAqSSMQmNnbY4XwWG0B', 'hoseath1@gmail.com', 'hosea', 'thornton', '+13092925848', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-05-31 15:12:50.124+00', '2025-06-06 16:55:06.622+00', NULL, NULL, 'active', '2025-06-11 12:29:56.98+00', 'synced', '"{\"id\":\"9wAqSSMQmNnbY4XwWG0B\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"hosea thornton\",\"firstName\":\"hosea\",\"lastName\":\"thornton\",\"companyName\":null,\"email\":\"hoseath1@gmail.com\",\"phone\":\"+13092925848\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-05-31T15:12:50.124Z\",\"dateUpdated\":\"2025-06-05T17:21:36.648Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228906622,\"customField\":[]}"', '2025-06-11 11:36:30.280766+00', '2025-06-11 12:29:56.98108+00');
INSERT INTO public.ghl_affiliates VALUES ('6a425ef0-567e-45e8-b63b-1a9fd2dc2f83', 'Axe1vLksxpcRXh5RdlrI', 'bwellsmarketing@gmail.com', 'bruce', 'wells', '+17576603087', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-05 00:30:45.958+00', '2025-06-06 16:55:05.835+00', NULL, NULL, 'active', '2025-06-11 12:29:56.758+00', 'synced', '"{\"id\":\"Axe1vLksxpcRXh5RdlrI\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"bruce wells\",\"firstName\":\"bruce\",\"lastName\":\"wells\",\"companyName\":null,\"email\":\"bwellsmarketing@gmail.com\",\"phone\":\"+17576603087\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-05T00:30:45.958Z\",\"dateUpdated\":\"2025-06-05T00:30:48.855Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228905835,\"customField\":[]}"', '2025-06-11 11:36:30.068855+00', '2025-06-11 12:29:56.759765+00');
INSERT INTO public.ghl_affiliates VALUES ('e444597c-b380-4df8-b49b-c1fc55a312fe', 'RnPZ7C8FWYbA8AM9kQPh', 'esther@motiargaman.com', 'esther', 'ullrich', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 19:54:39.346+00', '2025-06-08 21:26:21.711+00', NULL, NULL, 'active', '2025-06-11 12:29:56.789+00', 'synced', '"{\"id\":\"RnPZ7C8FWYbA8AM9kQPh\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"esther ullrich\",\"firstName\":\"esther\",\"lastName\":\"ullrich\",\"companyName\":null,\"email\":\"esther@motiargaman.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T19:54:39.346Z\",\"dateUpdated\":\"2025-06-07T08:24:33.949Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Berlin\",\"lastActivity\":1749417981711,\"customField\":[]}"', '2025-06-11 11:36:30.099128+00', '2025-06-11 12:29:56.791062+00');
INSERT INTO public.ghl_affiliates VALUES ('27826680-31fb-4524-bde8-b9335a28b051', 'QkmeUIAfp40rGIkDksEH', 'mugdha.mehta@gohighlevel.com', NULL, NULL, NULL, NULL, '"[]"', NULL, '2025-06-04 03:26:59.185+00', '2025-06-06 16:55:07.858+00', NULL, NULL, 'active', '2025-06-11 12:29:56.822+00', 'synced', '"{\"id\":\"QkmeUIAfp40rGIkDksEH\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"mugdha.mehta@gohighlevel.com\",\"firstName\":null,\"lastName\":null,\"companyName\":null,\"email\":\"mugdha.mehta@gohighlevel.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":null,\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T03:26:59.185Z\",\"dateUpdated\":\"2025-06-04T03:26:59.185Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":null,\"lastActivity\":1749228907858,\"customField\":[]}"', '2025-06-11 11:36:30.1298+00', '2025-06-11 12:29:56.823203+00');
INSERT INTO public.ghl_affiliates VALUES ('46691c26-26b9-48c8-9f79-a30fec105345', 'n6G2GyxiT2ZJwRLoCbzz', 'kris.dagent@gmail.com', 'kristina', 'q', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-03 11:41:46.415+00', '2025-06-07 02:56:18.358+00', NULL, NULL, 'active', '2025-06-11 12:29:56.856+00', 'synced', '"{\"id\":\"n6G2GyxiT2ZJwRLoCbzz\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"kristina q\",\"firstName\":\"kristina\",\"lastName\":\"q\",\"companyName\":null,\"email\":\"kris.dagent@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-03T11:41:46.415Z\",\"dateUpdated\":\"2025-06-04T02:56:13.505Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/London\",\"lastActivity\":1749264978358,\"customField\":[]}"', '2025-06-11 11:36:30.160111+00', '2025-06-11 12:29:56.857813+00');
INSERT INTO public.ghl_affiliates VALUES ('7492976d-801e-465f-9f95-1be9ca8ecfe6', 'Hw4SDP867CiPH2R1mRyh', 'myflex2500@gmail.com', 'zadreant', 'shelvin', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 18:29:14.364+00', '2025-06-06 18:29:28.184+00', NULL, NULL, 'active', '2025-06-11 12:29:56.894+00', 'synced', '"{\"id\":\"Hw4SDP867CiPH2R1mRyh\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"zadreant shelvin\",\"firstName\":\"zadreant\",\"lastName\":\"shelvin\",\"companyName\":null,\"email\":\"myflex2500@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T18:29:14.364Z\",\"dateUpdated\":\"2025-06-06T20:01:49.313Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749234568184,\"customField\":[]}"', '2025-06-11 11:36:30.196492+00', '2025-06-11 12:29:56.89588+00');
INSERT INTO public.ghl_affiliates VALUES ('2644050a-2227-439d-a4ea-e0c41597fb96', 'mVba0OSiuhnuTzVgX0AB', 'migueltorresco@gmail.com', 'miguel', 'torres', '+14075342383', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 14:40:25.666+00', '2025-06-06 16:55:02.514+00', NULL, NULL, 'active', '2025-06-11 12:29:56.925+00', 'synced', '"{\"id\":\"mVba0OSiuhnuTzVgX0AB\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"miguel torres\",\"firstName\":\"miguel\",\"lastName\":\"torres\",\"companyName\":null,\"email\":\"migueltorresco@gmail.com\",\"phone\":\"+14075342383\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T14:40:25.666Z\",\"dateUpdated\":\"2025-06-11T00:59:40.470Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228902514,\"customField\":[]}"', '2025-06-11 11:36:30.227837+00', '2025-06-11 12:29:56.926793+00');
INSERT INTO public.ghl_affiliates VALUES ('a1b65224-31be-4e9a-98c3-de3a7747a647', 'ZUL2Ey4FsPImSPvw8XsX', 'epr623@gmail.com', 'ethel', 'robinson', '+13344129928', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-01 23:43:36.451+00', '2025-06-06 16:55:02.327+00', NULL, NULL, 'active', '2025-06-11 12:29:56.956+00', 'synced', '"{\"id\":\"ZUL2Ey4FsPImSPvw8XsX\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"ethel robinson\",\"firstName\":\"ethel\",\"lastName\":\"robinson\",\"companyName\":null,\"email\":\"epr623@gmail.com\",\"phone\":\"+13344129928\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-01T23:43:36.451Z\",\"dateUpdated\":\"2025-06-06T01:24:43.894Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228902327,\"customField\":[]}"', '2025-06-11 11:36:30.256995+00', '2025-06-11 12:29:56.957338+00');
INSERT INTO public.ghl_affiliates VALUES ('dee0373e-2bce-4d25-8f39-bc9785b11f9d', '8tgyZX1v2Op7wS5Vf9lJ', 'sexanaf670@claspira.com', 'john', 'doe', NULL, 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-05-31 13:49:02.818+00', '2025-06-06 16:55:03.035+00', NULL, NULL, 'active', '2025-06-11 12:29:56.986+00', 'synced', '"{\"id\":\"8tgyZX1v2Op7wS5Vf9lJ\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"john doe\",\"firstName\":\"john\",\"lastName\":\"doe\",\"companyName\":null,\"email\":\"sexanaf670@claspira.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-05-31T13:49:02.818Z\",\"dateUpdated\":\"2025-06-04T13:49:06.703Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Madrid\",\"lastActivity\":1749228903035,\"customField\":[]}"', '2025-06-11 11:36:30.286477+00', '2025-06-11 12:29:56.987459+00');
INSERT INTO public.ghl_affiliates VALUES ('a073f073-b0d9-40d0-8a18-724a35ac23ff', 'AJCtHgSaJDFwYa5wQOA0', 'aimitan.cram@gmail.com', 'aimi', 'aimi', '+60149337688', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 22:18:50.425+00', '2025-06-08 22:18:56.44+00', NULL, NULL, 'active', '2025-06-11 12:29:56.764+00', 'synced', '"{\"id\":\"AJCtHgSaJDFwYa5wQOA0\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"aimi aimi\",\"firstName\":\"aimi\",\"lastName\":\"aimi\",\"companyName\":null,\"email\":\"aimitan.cram@gmail.com\",\"phone\":\"+60149337688\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T22:18:50.425Z\",\"dateUpdated\":\"2025-06-10T03:40:09.789Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Asia/Kuala_Lumpur\",\"lastActivity\":1749421136440,\"customField\":[]}"', '2025-06-11 11:36:30.0755+00', '2025-06-11 12:29:56.765461+00');
INSERT INTO public.ghl_affiliates VALUES ('6e5a536c-5478-46d2-ba74-c1b18a7dd4d4', '5jfevqQ9Z2dW4QRrnADS', 'frderickgreen@gmail.com', 'frederick', 'green', '+19124297656', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 12:33:49.87+00', '2025-06-08 12:33:56.709+00', NULL, NULL, 'active', '2025-06-11 12:29:56.795+00', 'synced', '"{\"id\":\"5jfevqQ9Z2dW4QRrnADS\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"frederick green\",\"firstName\":\"frederick\",\"lastName\":\"green\",\"companyName\":null,\"email\":\"frderickgreen@gmail.com\",\"phone\":\"+19124297656\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T12:33:49.870Z\",\"dateUpdated\":\"2025-06-04T12:33:53.388Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749386036709,\"customField\":[]}"', '2025-06-11 11:36:30.104489+00', '2025-06-11 12:29:56.79669+00');
INSERT INTO public.ghl_affiliates VALUES ('320aaae3-f891-41ca-91d3-b541c2e87889', '3CkQcBBqgDpwRCQ3yEF9', 'sherrystanley87@gmail.com', 'sherry', 'stanley', '+13175070629', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-03 23:37:06.184+00', '2025-06-07 02:56:20.458+00', NULL, NULL, 'active', '2025-06-11 12:29:56.828+00', 'synced', '"{\"id\":\"3CkQcBBqgDpwRCQ3yEF9\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"sherry stanley\",\"firstName\":\"sherry\",\"lastName\":\"stanley\",\"companyName\":null,\"email\":\"sherrystanley87@gmail.com\",\"phone\":\"+13175070629\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-03T23:37:06.184Z\",\"dateUpdated\":\"2025-06-04T02:56:15.940Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749264980458,\"customField\":[]}"', '2025-06-11 11:36:30.135649+00', '2025-06-11 12:29:56.829638+00');
INSERT INTO public.ghl_affiliates VALUES ('1e5701aa-95d7-47c4-9c08-8039563bfca7', 'gHlAnHlvWMnmz6lRvqJC', 'cheryl_lovell2@yahoo.com', 'cheryl', 'lovell', '+12063131940', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-03 02:50:27.73+00', '2025-06-07 02:50:33.339+00', NULL, NULL, 'active', '2025-06-11 12:29:56.863+00', 'synced', '"{\"id\":\"gHlAnHlvWMnmz6lRvqJC\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"cheryl lovell\",\"firstName\":\"cheryl\",\"lastName\":\"lovell\",\"companyName\":null,\"email\":\"cheryl_lovell2@yahoo.com\",\"phone\":\"+12063131940\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-03T02:50:27.730Z\",\"dateUpdated\":\"2025-06-06T20:02:17.726Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Los_Angeles\",\"lastActivity\":1749264633339,\"customField\":[]}"', '2025-06-11 11:36:30.165963+00', '2025-06-11 12:29:56.864218+00');
INSERT INTO public.ghl_affiliates VALUES ('43e38314-cf98-4fc2-9ea4-8d2da854af6c', 'lg5sbUICeivzXsaGCLQP', 'beachsidemoney@gmail.com', 'jennifer', 'bradshaw', '+19493105344', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 19:41:22.768+00', '2025-06-06 19:41:30.539+00', NULL, NULL, 'active', '2025-06-11 12:29:56.875+00', 'synced', '"{\"id\":\"lg5sbUICeivzXsaGCLQP\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jennifer bradshaw\",\"firstName\":\"jennifer\",\"lastName\":\"bradshaw\",\"companyName\":null,\"email\":\"beachsidemoney@gmail.com\",\"phone\":\"+19493105344\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T19:41:22.768Z\",\"dateUpdated\":\"2025-06-06T20:17:42.376Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Los_Angeles\",\"lastActivity\":1749238890539,\"customField\":[]}"', '2025-06-11 11:36:30.178048+00', '2025-06-11 12:29:56.876846+00');
INSERT INTO public.ghl_affiliates VALUES ('2c24ac5a-9d77-4565-9fc1-566775aa3202', 'Ez4etgkouD9i9mokuNuE', 'jaydmartinez717@gmail.com', 'jay', 'martinez', '+13306071696', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 15:46:31.999+00', '2025-06-06 16:55:04.679+00', NULL, NULL, 'active', '2025-06-11 12:29:56.907+00', 'synced', '"{\"id\":\"Ez4etgkouD9i9mokuNuE\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jay martinez\",\"firstName\":\"jay\",\"lastName\":\"martinez\",\"companyName\":null,\"email\":\"jaydmartinez717@gmail.com\",\"phone\":\"+13306071696\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T15:46:31.999Z\",\"dateUpdated\":\"2025-06-02T15:46:35.461Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228904679,\"customField\":[]}"', '2025-06-11 11:36:30.209233+00', '2025-06-11 12:29:56.908249+00');
INSERT INTO public.ghl_affiliates VALUES ('2aceb747-0368-4c42-9e7a-86b96b1f8b58', 'E0VvsSpqiRYez3FMrUx8', 'tegrisgroup@gmail.com', 'jon', 'nelson', '+16122502642', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-02 01:41:39.684+00', '2025-06-06 16:55:04.146+00', NULL, NULL, 'active', '2025-06-11 12:29:56.938+00', 'synced', '"{\"id\":\"E0VvsSpqiRYez3FMrUx8\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jon nelson\",\"firstName\":\"jon\",\"lastName\":\"nelson\",\"companyName\":null,\"email\":\"tegrisgroup@gmail.com\",\"phone\":\"+16122502642\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-02T01:41:39.684Z\",\"dateUpdated\":\"2025-06-02T01:41:43.270Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749228904146,\"customField\":[]}"', '2025-06-11 11:36:30.238985+00', '2025-06-11 12:29:56.939504+00');
INSERT INTO public.ghl_affiliates VALUES ('c4fe973b-e66f-475c-9966-63d8431c63b5', 'i2jdUEdxWdbjey8wgafm', 'msbmwells@gmail.com', 'bernadette', 'wells', '+19196956053', 'rise signup', '"[\"rego-rise66\",\"manifest-your-dreams\"]"', NULL, '2025-06-01 01:56:31.708+00', '2025-06-06 16:55:04.903+00', NULL, NULL, 'active', '2025-06-11 12:29:56.967+00', 'synced', '"{\"id\":\"i2jdUEdxWdbjey8wgafm\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"bernadette wells\",\"firstName\":\"bernadette\",\"lastName\":\"wells\",\"companyName\":null,\"email\":\"msbmwells@gmail.com\",\"phone\":\"+19196956053\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-01T01:56:31.708Z\",\"dateUpdated\":\"2025-06-09T01:12:12.553Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\",\"manifest-your-dreams\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749228904903,\"customField\":[]}"', '2025-06-11 11:36:30.268681+00', '2025-06-11 12:29:56.96964+00');
INSERT INTO public.ghl_affiliates VALUES ('31651f5e-e940-47f4-994f-abe82018ea74', '3238ZUFeA4otrQrK9HLn', 'rima.valunaite@hotmail.com', 'rima', 'valunaite', '+353877653073', 'Main Site', '"[]"', NULL, '2025-06-10 07:17:36.778+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.288+00', 'synced', '"{\"id\":\"3238ZUFeA4otrQrK9HLn\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"rima valunaite\",\"firstName\":\"rima\",\"lastName\":\"valunaite\",\"companyName\":null,\"email\":\"rima.valunaite@hotmail.com\",\"phone\":\"+353877653073\",\"dnd\":false,\"type\":\"lead\",\"source\":\"Main Site\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-10T07:17:36.778Z\",\"dateUpdated\":\"2025-06-10T07:17:36.778Z\",\"dateOfBirth\":null,\"tags\":[],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Dublin\",\"customField\":[]}"', '2025-06-11 11:36:29.617835+00', '2025-06-11 12:29:56.299949+00');
INSERT INTO public.ghl_affiliates VALUES ('409b27a0-9ace-418d-87d8-7c22d1334d24', 'nUKTRrHB7OUFi7PjqOep', 'aprilsmith1883@gmail.com', 'april', 'smith', NULL, 'manifest your dreams', '"[\"manifest-your-dreams\",\"contact-page-form\"]"', NULL, '2025-06-08 23:47:31.853+00', NULL, NULL, NULL, 'active', '2025-06-11 12:29:56.367+00', 'synced', '"{\"id\":\"nUKTRrHB7OUFi7PjqOep\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"april smith\",\"firstName\":\"april\",\"lastName\":\"smith\",\"companyName\":null,\"email\":\"aprilsmith1883@gmail.com\",\"phone\":null,\"dnd\":false,\"type\":\"lead\",\"source\":\"manifest your dreams\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-08T23:47:31.853Z\",\"dateUpdated\":\"2025-06-08T23:51:38.095Z\",\"dateOfBirth\":null,\"tags\":[\"manifest-your-dreams\",\"contact-page-form\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"customField\":[{\"id\":\"bGpf3Vj9yLedDUjBcfBO\",\"value\":\"Hi Jenna, I was/am a member of MDC and have a client seeking the Hemp Coffee.  Will you still be selling it?  I also just watched the zoom video and am very interested in your new product.  How do I keep up with you on Telegram etc.?\"},{\"id\":\"j7945LHFg9RbdHMUyZBO\",\"value\":\"Inquiry\"}]}"', '2025-06-11 11:36:29.681216+00', '2025-06-11 12:29:56.369885+00');
INSERT INTO public.ghl_affiliates VALUES ('bf9f2d97-05ce-418f-9a5a-162716fdd8cc', 'hAk6MmxVtBO6st1lkPJo', 'iamdeechosen1@gmail.com', 'dee', 'alexander', '+18883128999', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 12:21:00.258+00', '2025-06-08 12:21:06.179+00', NULL, NULL, 'active', '2025-06-11 12:29:56.808+00', 'synced', '"{\"id\":\"hAk6MmxVtBO6st1lkPJo\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"dee alexander\",\"firstName\":\"dee\",\"lastName\":\"alexander\",\"companyName\":null,\"email\":\"iamdeechosen1@gmail.com\",\"phone\":\"+18883128999\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T12:21:00.258Z\",\"dateUpdated\":\"2025-06-06T19:57:55.306Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749385266179,\"customField\":[]}"', '2025-06-11 11:36:30.117599+00', '2025-06-11 12:29:56.809503+00');
INSERT INTO public.ghl_affiliates VALUES ('dba0fbd7-8ba0-498a-b1f0-92c7315ae7e4', '9XZwzkKu8IjTsYvhlGnl', 'xavier.bobino@gmail.com', 'xavier', 'bobino', '+14093322023', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-03 14:43:06.563+00', '2025-06-07 02:56:20.441+00', NULL, NULL, 'active', '2025-06-11 12:29:56.841+00', 'synced', '"{\"id\":\"9XZwzkKu8IjTsYvhlGnl\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"xavier bobino\",\"firstName\":\"xavier\",\"lastName\":\"bobino\",\"companyName\":null,\"email\":\"xavier.bobino@gmail.com\",\"phone\":\"+14093322023\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-03T14:43:06.563Z\",\"dateUpdated\":\"2025-06-04T02:56:15.197Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Chicago\",\"lastActivity\":1749264980441,\"customField\":[]}"', '2025-06-11 11:36:30.147323+00', '2025-06-11 12:29:56.842891+00');
INSERT INTO public.ghl_affiliates VALUES ('5b87f8e5-242a-4d40-8625-523b383e8927', 'xcFNHmgWfgmFuk1BXw6U', 'schaffatt1@gmail.com', 'stacyann', 'chaffatt', '+14049204806', 'Main Site', '"[\"purchase-3mastery\"]"', NULL, '2025-06-07 01:01:50.96+00', '2025-06-07 01:03:06.279+00', NULL, NULL, 'active', '2025-06-11 12:29:56.436+00', 'synced', '"{\"id\":\"xcFNHmgWfgmFuk1BXw6U\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"stacyann chaffatt\",\"firstName\":\"stacyann\",\"lastName\":\"chaffatt\",\"companyName\":null,\"email\":\"schaffatt1@gmail.com\",\"phone\":\"+14049204806\",\"dnd\":false,\"type\":\"lead\",\"source\":\"Main Site\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T01:01:50.960Z\",\"dateUpdated\":\"2025-06-07T01:02:04.614Z\",\"dateOfBirth\":null,\"tags\":[\"purchase-3mastery\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Jamaica\",\"lastActivity\":1749258186279,\"customField\":[]}"', '2025-06-11 11:36:29.748572+00', '2025-06-11 12:29:56.437599+00');
INSERT INTO public.ghl_affiliates VALUES ('747ad7d4-5600-4a68-adaf-d712758ab407', 'bV1RDsHfqVXRlp3nn5cc', 'gugz_kandola@hotmail.co.uk', 'arvinder', 'kandola', '+447840397595', 'Main Site', '"[\"purchase-3mastery\",\"contact-page-form\"]"', NULL, '2025-06-07 02:37:38.424+00', '2025-06-07 02:39:14.396+00', NULL, NULL, 'active', '2025-06-11 12:29:56.414+00', 'synced', '"{\"id\":\"bV1RDsHfqVXRlp3nn5cc\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"arvinder kandola\",\"firstName\":\"arvinder\",\"lastName\":\"kandola\",\"companyName\":null,\"email\":\"gugz_kandola@hotmail.co.uk\",\"phone\":\"+447840397595\",\"dnd\":false,\"type\":\"lead\",\"source\":\"Main Site\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T02:37:38.424Z\",\"dateUpdated\":\"2025-06-09T13:56:58.743Z\",\"dateOfBirth\":null,\"tags\":[\"purchase-3mastery\",\"contact-page-form\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/London\",\"lastActivity\":1749263954396,\"customField\":[{\"id\":\"4AWoogNCDg1emkmjxtp7\",\"value\":\"Got charged twice\"},{\"id\":\"bGpf3Vj9yLedDUjBcfBO\",\"value\":\"Hi i purchased the package for $147 and have been charged twice my invoice numbers are REC10033 and REC10034\"},{\"id\":\"j7945LHFg9RbdHMUyZBO\",\"value\":\"Inquiry\"}]}"', '2025-06-11 11:36:29.727539+00', '2025-06-11 12:29:56.416019+00');
INSERT INTO public.ghl_affiliates VALUES ('5d834f65-299f-4b14-8b64-748b59ab1cc1', 'ymH5cFbWFklIRSJqSovO', 'rochellebeachy79@gmail.com', 'rochelle', 'beachy', '+12707928386', 'rise signup', '"[\"rego-rise66\",\"purchase-3mastery\"]"', NULL, '2025-06-07 01:03:59.501+00', '2025-06-10 16:36:24.995+00', NULL, NULL, 'active', '2025-06-11 12:29:56.429+00', 'synced', '"{\"id\":\"ymH5cFbWFklIRSJqSovO\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"rochelle beachy\",\"firstName\":\"rochelle\",\"lastName\":\"beachy\",\"companyName\":null,\"email\":\"rochellebeachy79@gmail.com\",\"phone\":\"+12707928386\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T01:03:59.501Z\",\"dateUpdated\":\"2025-06-10T16:35:11.276Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\",\"purchase-3mastery\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/New_York\",\"lastActivity\":1749573384995,\"customField\":[]}"', '2025-06-11 11:36:29.741963+00', '2025-06-11 12:29:56.430827+00');
INSERT INTO public.ghl_affiliates VALUES ('16b33482-ead8-4927-924a-1fd7ab189ca7', '46kAk3kfvgygv0qKTQsT', 'jennifer.schaap8@gmail.com', 'jennifer', 'schaap', '+17195538125', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-07 00:59:44.268+00', '2025-06-07 00:59:59.492+00', NULL, NULL, 'active', '2025-06-11 12:29:56.443+00', 'synced', '"{\"id\":\"46kAk3kfvgygv0qKTQsT\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"jennifer schaap\",\"firstName\":\"jennifer\",\"lastName\":\"schaap\",\"companyName\":null,\"email\":\"jennifer.schaap8@gmail.com\",\"phone\":\"+17195538125\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-07T00:59:44.268Z\",\"dateUpdated\":\"2025-06-07T00:59:47.845Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Denver\",\"lastActivity\":1749257999492,\"customField\":[]}"', '2025-06-11 11:36:29.754702+00', '2025-06-11 12:29:56.444657+00');
INSERT INTO public.ghl_affiliates VALUES ('2f7123be-edbb-462c-b3fc-206924ed9319', '5WojepgQezidErMaVkzR', 'designsbypam58@gmail.com', 'pamela', 'arthur', '+12485204439', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-06 21:20:05.037+00', '2025-06-06 21:20:22.119+00', NULL, NULL, 'active', '2025-06-11 12:29:56.457+00', 'synced', '"{\"id\":\"5WojepgQezidErMaVkzR\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"pamela arthur\",\"firstName\":\"pamela\",\"lastName\":\"arthur\",\"companyName\":null,\"email\":\"designsbypam58@gmail.com\",\"phone\":\"+12485204439\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-06T21:20:05.037Z\",\"dateUpdated\":\"2025-06-06T21:20:08.817Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"America/Detroit\",\"lastActivity\":1749244822119,\"customField\":[]}"', '2025-06-11 11:36:29.768893+00', '2025-06-11 12:29:56.459177+00');
INSERT INTO public.ghl_affiliates VALUES ('1e307fba-aec2-45e2-aa2b-35a5092d687a', 'ffZPe5eiVYLpWBumlaa2', 'richardjgarcia75@gmail.com', 'richard', 'garcia', '+34678784359', 'rise signup', '"[\"rego-rise66\"]"', NULL, '2025-06-04 21:35:24.526+00', '2025-06-08 21:35:31.381+00', NULL, NULL, 'active', '2025-06-11 12:29:56.776+00', 'synced', '"{\"id\":\"ffZPe5eiVYLpWBumlaa2\",\"locationId\":\"w01Gc7T4b0tKSDQdKhuN\",\"contactName\":\"richard garcia\",\"firstName\":\"richard\",\"lastName\":\"garcia\",\"companyName\":null,\"email\":\"richardjgarcia75@gmail.com\",\"phone\":\"+34678784359\",\"dnd\":false,\"type\":\"lead\",\"source\":\"rise signup\",\"assignedTo\":null,\"city\":null,\"state\":null,\"postalCode\":null,\"address1\":null,\"dateAdded\":\"2025-06-04T21:35:24.526Z\",\"dateUpdated\":\"2025-06-04T21:35:27.924Z\",\"dateOfBirth\":null,\"tags\":[\"rego-rise66\"],\"country\":\"US\",\"website\":null,\"timezone\":\"Europe/Madrid\",\"lastActivity\":1749418531381,\"customField\":[]}"', '2025-06-11 11:36:30.086986+00', '2025-06-11 12:29:56.777921+00');


--
-- Data for Name: goaffpro_affiliates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.goaffpro_affiliates VALUES ('44eadf75-81fb-433e-b701-c9e8e51e2a8d', '17924163', '302mws@gmail.com', 'Michele', 'Stevenson', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17924163, "name": "Michele Stevenson", "tags": [], "email": "302mws@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Stevenson", "first_name": "Michele"}', 'goaffpro', '2025-06-11 05:53:36.04989+00', '2025-06-11 11:37:43.936144+00');
INSERT INTO public.goaffpro_affiliates VALUES ('ada53f79-8411-4b80-b614-578ff8985db3', '10030018', 'Ashleyhampton@me.com', 'Ashley', 'Agee', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 10030018, "name": "Ashley Agee", "tags": [], "email": "Ashleyhampton@me.com", "phone": null, "status": "approved", "address": null, "last_name": "Agee", "first_name": "Ashley"}', 'goaffpro', '2025-06-11 05:53:36.057131+00', '2025-06-11 11:37:43.943043+00');
INSERT INTO public.goaffpro_affiliates VALUES ('fce2de7a-f2e3-4183-bae9-8e0e8cb3d4d4', '17916897', 'tracyjow57@gmail.com', 'TracyJo', 'Winnemucca', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17916897, "name": "TracyJo Winnemucca", "tags": [], "email": "tracyjow57@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Winnemucca", "first_name": "TracyJo"}', 'goaffpro', '2025-06-11 05:53:36.063392+00', '2025-06-11 11:37:43.949415+00');
INSERT INTO public.goaffpro_affiliates VALUES ('b03bdbac-02ac-4568-9a36-e5bc2eb77ba1', '17909983', 'shanefozard@gmail.com', 'Shane', NULL, NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17909983, "name": "Shane", "tags": [], "email": "shanefozard@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "", "first_name": "Shane"}', 'goaffpro', '2025-06-11 05:53:36.070299+00', '2025-06-11 11:37:43.957013+00');
INSERT INTO public.goaffpro_affiliates VALUES ('6cfaac94-94b4-4539-8f05-8b2df1dbe45a', '17889903', 'galelynn13@gmail.com', 'Gale', 'Buss', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17889903, "name": "Gale Buss", "tags": [], "email": "galelynn13@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Buss", "first_name": "Gale"}', 'goaffpro', '2025-06-11 05:53:36.076854+00', '2025-06-11 11:37:43.963607+00');
INSERT INTO public.goaffpro_affiliates VALUES ('9e568d1a-4739-429c-a71a-1d4f4a7043a2', '17888596', 'dawn.mafana@gmail.com', 'Dawn', 'Mafana', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17888596, "name": "Dawn Mafana", "tags": [], "email": "dawn.mafana@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Mafana", "first_name": "Dawn"}', 'goaffpro', '2025-06-11 05:53:36.08269+00', '2025-06-11 11:37:43.970438+00');
INSERT INTO public.goaffpro_affiliates VALUES ('051f1145-4001-4f5c-b5c9-f787ef2973a6', '17888462', 'colleenh@ameritech.net', 'Colleen', 'Hunt', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17888462, "name": "Colleen Hunt", "tags": [], "email": "colleenh@ameritech.net", "phone": null, "status": "approved", "address": null, "last_name": "Hunt", "first_name": "Colleen"}', 'goaffpro', '2025-06-11 05:53:36.089908+00', '2025-06-11 11:37:43.977155+00');
INSERT INTO public.goaffpro_affiliates VALUES ('ccca8107-3232-45ca-a28e-b16266fbe845', '17888426', 'Lisanadine420@gmail.com', 'Lisa', 'Nadine Faulkner', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17888426, "name": "Lisa Nadine Faulkner", "tags": [], "email": "Lisanadine420@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Nadine Faulkner", "first_name": "Lisa"}', 'goaffpro', '2025-06-11 05:53:36.096144+00', '2025-06-11 11:37:43.983724+00');
INSERT INTO public.goaffpro_affiliates VALUES ('d883ea98-36a0-4fcf-b8fd-ec82839cd3cd', '17888384', 'sbaker1272@gmail.com', 'Sandy', 'Baker', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17888384, "name": "Sandy Baker", "tags": [], "email": "sbaker1272@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Baker", "first_name": "Sandy"}', 'goaffpro', '2025-06-11 05:53:36.102288+00', '2025-06-11 11:37:43.990663+00');
INSERT INTO public.goaffpro_affiliates VALUES ('258e1d3c-ee5d-4583-bea9-36e322486801', '17972554', 'Xfactorsystems@gmail.com', 'Sean', 'Smith', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17972554, "name": "Sean Smith", "tags": [], "email": "Xfactorsystems@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Smith", "first_name": "Sean"}', 'goaffpro', '2025-06-11 05:53:35.975847+00', '2025-06-11 11:37:43.863253+00');
INSERT INTO public.goaffpro_affiliates VALUES ('fd612f4b-feba-455d-a03b-5418f077e540', '17970724', 'Hempchic1@gmail.com', 'Cheri', 'Becker', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17970724, "name": "Cheri Becker", "tags": [], "email": "Hempchic1@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Becker", "first_name": "Cheri"}', 'goaffpro', '2025-06-11 05:53:35.990451+00', '2025-06-11 11:37:43.876666+00');
INSERT INTO public.goaffpro_affiliates VALUES ('25cfae90-1bd8-4ce2-b8a8-c13af38ca420', '17963152', 'laurahargrave88@gmail.com', 'Laura', 'Hargrave', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17963152, "name": "Laura Hargrave", "tags": [], "email": "laurahargrave88@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Hargrave", "first_name": "Laura"}', 'goaffpro', '2025-06-11 05:53:35.997713+00', '2025-06-11 11:37:43.883833+00');
INSERT INTO public.goaffpro_affiliates VALUES ('77aa41ee-ab7e-4699-85b9-6e9729f92947', '13469383', 'email2mjc@gmail.com', 'mello', 'cavale', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 13469383, "name": "mello cavale", "tags": [], "email": "email2mjc@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "cavale", "first_name": "mello"}', 'goaffpro', '2025-06-11 05:53:36.006408+00', '2025-06-11 11:37:43.891616+00');
INSERT INTO public.goaffpro_affiliates VALUES ('61ade0cd-5066-4a35-af66-0e52215eebba', '17949619', 'rainbowbrat30@gmail.com', 'Nicole', 'Bachtel', '3606493192', NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17949619, "name": "Nicole Bachtel", "tags": [], "email": "rainbowbrat30@gmail.com", "phone": "3606493192", "status": "approved", "address": null, "last_name": "Bachtel", "first_name": "Nicole"}', 'goaffpro', '2025-06-11 05:53:36.014858+00', '2025-06-11 11:37:43.898903+00');
INSERT INTO public.goaffpro_affiliates VALUES ('6fc80238-db82-450b-81d5-71685f09d8dc', '17939245', 'mariuszjump@gmail.com', 'Mariusz', 'Zuk', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17939245, "name": "Mariusz Zuk", "tags": [], "email": "mariuszjump@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Zuk", "first_name": "Mariusz"}', 'goaffpro', '2025-06-11 05:53:36.023165+00', '2025-06-11 11:37:43.907132+00');
INSERT INTO public.goaffpro_affiliates VALUES ('7bd33382-4ed4-422a-98fb-f7d16a648ff3', '17933214', 'peaceoftheflower@gmail.com', 'Victoria', 'Geisler', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17933214, "name": "Victoria Geisler", "tags": [], "email": "peaceoftheflower@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Geisler", "first_name": "Victoria"}', 'goaffpro', '2025-06-11 05:53:36.029487+00', '2025-06-11 11:37:43.914022+00');
INSERT INTO public.goaffpro_affiliates VALUES ('72ce5777-3427-4550-9bf8-b662f7e4e7d9', '17928152', 'kimsterkat@gmail.com', 'Kim', 'Tornero', NULL, NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17928152, "name": "Kim Tornero", "tags": [], "email": "kimsterkat@gmail.com", "phone": null, "status": "approved", "address": null, "last_name": "Tornero", "first_name": "Kim"}', 'goaffpro', '2025-06-11 05:53:36.035624+00', '2025-06-11 11:37:43.921173+00');
INSERT INTO public.goaffpro_affiliates VALUES ('be783304-a723-4c97-b54a-0f8030e1b9af', '17926290', 'gabemunoz1@gmail.com', 'Gabe', 'Munoz', '+15596810299', NULL, 'approved', NULL, NULL, NULL, 0.00, 0.00, 0, '[]', NULL, '{"id": 17926290, "name": "Gabe Munoz", "tags": [], "email": "gabemunoz1@gmail.com", "phone": "+15596810299", "status": "approved", "address": null, "last_name": "Munoz", "first_name": "Gabe"}', 'goaffpro', '2025-06-11 05:53:36.043324+00', '2025-06-11 11:37:43.928725+00');


--
-- Data for Name: goaffpro_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.goaffpro_orders VALUES ('b9e88f0b-326d-4b0b-9a72-ef85d3a295a6', '56928029', '17924163', '44eadf75-81fb-433e-b701-c9e8e51e2a8d', NULL, '302mws@gmail.com', 'Michele Stevenson', 149.99, 37.50, NULL, 'approved', NULL, NULL, '[{"cv": 149.99, "id": 15332047913208, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}]', '{"id": 56928029, "status": "approved", "created_at": "2025-06-03T15:57:32.000Z", "line_items": [{"cv": 149.99, "id": 15332047913208, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}], "updated_at": "2025-06-03T15:58:01.000Z", "affiliate_id": 17924163, "customer_email": "302mws@gmail.com", "shipping_address": {"zip": "32258-2159", "city": "Jacksonville", "name": "Michele Stevenson", "phone": null, "state": "Florida", "company": null, "country": "United States", "address_1": "12540 Deeder Ln", "address_2": null, "last_name": "Stevenson", "first_name": "Michele"}}', 'goaffpro', '2025-06-11 05:53:36.306135+00', '2025-06-11 11:37:44.295508+00');
INSERT INTO public.goaffpro_orders VALUES ('3b8355ec-ab1c-4a10-8c65-901048d0a251', '56725388', '10030018', 'ada53f79-8411-4b80-b614-578ff8985db3', NULL, 'ashleyhampton@me.com', 'Ashley Agee', 149.99, 37.50, NULL, 'approved', NULL, NULL, '[{"cv": 149.99, "id": 15323275460856, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}]', '{"id": 56725388, "status": "approved", "created_at": "2025-05-30T17:02:12.000Z", "line_items": [{"cv": 149.99, "id": 15323275460856, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}], "updated_at": "2025-05-30T17:02:13.000Z", "affiliate_id": 10030018, "customer_email": "ashleyhampton@me.com", "shipping_address": {"zip": "30115", "city": "Canton", "name": "Ashley Agee", "phone": null, "state": "Georgia", "company": null, "country": "United States", "address_1": "701 Crescent Circle", "address_2": null, "last_name": "Agee", "first_name": "Ashley"}}', 'goaffpro', '2025-06-11 05:53:36.313286+00', '2025-06-11 11:37:44.303811+00');
INSERT INTO public.goaffpro_orders VALUES ('16da47cf-31e2-40ef-af87-e7663d874709', '56999525', '17888426', 'ccca8107-3232-45ca-a28e-b16266fbe845', NULL, 'lisanadine420@gmail.com', 'Lisa Faulkner', 149.99, 37.50, NULL, 'approved', NULL, NULL, '[{"cv": 149.99, "id": 15335325958392, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}]', '{"id": 56999525, "status": "approved", "created_at": "2025-06-05T00:13:19.000Z", "line_items": [{"cv": 149.99, "id": 15335325958392, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}], "updated_at": "2025-06-05T00:13:20.000Z", "affiliate_id": 17888426, "customer_email": "lisanadine420@gmail.com", "shipping_address": {"zip": "85351", "city": "Sun City", "name": "Lisa Faulkner", "phone": null, "state": "Arizona", "company": null, "country": "United States", "address_1": "10344 West Camden Avenue", "address_2": null, "last_name": "Faulkner", "first_name": "Lisa"}}', 'goaffpro', '2025-06-11 05:53:36.291792+00', '2025-06-11 11:37:44.281754+00');
INSERT INTO public.goaffpro_orders VALUES ('ffdf965d-fddd-4ba9-8b46-5547aa81b750', '56670912', '17888426', 'ccca8107-3232-45ca-a28e-b16266fbe845', NULL, '8382252810488', 'TracyJo Winnemucca', 149.99, 37.50, NULL, 'approved', NULL, NULL, '[{"cv": 149.99, "id": 15321524928760, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}]', '{"id": 56670912, "status": "approved", "created_at": "2025-05-29T20:50:56.000Z", "line_items": [{"cv": 149.99, "id": 15321524928760, "sku": "300130DAY", "name": "FCE™ Capsules - 30ct.", "price": "149.99", "total": 149.99, "vendor": "Cryosonic Plant Life Club", "quantity": 1, "total_tax": 0, "commission": 37.4975, "product_id": 9069747994872, "total_price": 149.99, "variation_id": 46450854789368, "total_discount": 0, "commission_type": "percentage", "commission_value": 25, "exclude_discounts": true, "gift_card_percentage": 0, "gift_card_amount_used": 0}], "updated_at": "2025-05-29T20:50:57.000Z", "affiliate_id": 17888426, "customer_email": "8382252810488", "shipping_address": {"zip": "93274", "city": "Tulare", "name": "TracyJo Winnemucca", "phone": null, "state": "California", "company": null, "country": "United States", "address_1": "1501 East Cypress Avenue", "address_2": "#20", "last_name": "Winnemucca", "first_name": "TracyJo"}}', 'goaffpro', '2025-06-11 05:53:36.322665+00', '2025-06-11 11:37:44.312551+00');


--
-- Data for Name: goaffpro_commissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: goaffpro_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: goaffpro_rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: jennaz_affiliates; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: jennaz_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: jennaz_commissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: jennaz_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: jennaz_rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mightynetworks_affiliates; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mightynetworks_referrals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mightynetworks_commissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mightynetworks_import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mightynetworks_payouts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: multi_level_commissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payouts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: referral_relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopify_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopify_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopify_products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopify_webhooks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: team_statistics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: messages_2025_06_10; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2025_06_11; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2025_06_12; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2025_06_13; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2025_06_14; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

INSERT INTO realtime.schema_migrations VALUES (20211116024918, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116045059, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116050929, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116051442, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116212300, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116213355, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116213934, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211116214523, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211122062447, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211124070109, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211202204204, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211202204605, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211210212804, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20211228014915, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220107221237, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220228202821, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220312004840, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220603231003, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220603232444, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220615214548, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220712093339, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220908172859, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20220916233421, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230119133233, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230128025114, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230128025212, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230227211149, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230228184745, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230308225145, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20230328144023, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20231018144023, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20231204144023, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20231204144024, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20231204144025, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240108234812, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240109165339, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240227174441, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240311171622, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240321100241, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240401105812, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240418121054, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240523004032, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240618124746, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240801235015, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240805133720, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240827160934, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240919163303, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20240919163305, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241019105805, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241030150047, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241108114728, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241121104152, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241130184212, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241220035512, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241220123912, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20241224161212, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20250107150512, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20250110162412, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20250123174212, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20250128220012, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20250506224012, '2025-06-11 05:46:20');
INSERT INTO realtime.schema_migrations VALUES (20250523164012, '2025-06-11 05:46:20');


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.migrations VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2025-06-11 05:47:09.36888');
INSERT INTO storage.migrations VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2025-06-11 05:47:09.372318');
INSERT INTO storage.migrations VALUES (2, 'storage-schema', '5c7968fd083fcea04050c1b7f6253c9771b99011', '2025-06-11 05:47:09.374453');
INSERT INTO storage.migrations VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2025-06-11 05:47:09.385357');
INSERT INTO storage.migrations VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2025-06-11 05:47:09.396091');
INSERT INTO storage.migrations VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2025-06-11 05:47:09.398927');
INSERT INTO storage.migrations VALUES (6, 'change-column-name-in-get-size', 'f93f62afdf6613ee5e7e815b30d02dc990201044', '2025-06-11 05:47:09.401863');
INSERT INTO storage.migrations VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2025-06-11 05:47:09.404462');
INSERT INTO storage.migrations VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2025-06-11 05:47:09.406363');
INSERT INTO storage.migrations VALUES (9, 'fix-search-function', '3a0af29f42e35a4d101c259ed955b67e1bee6825', '2025-06-11 05:47:09.408182');
INSERT INTO storage.migrations VALUES (10, 'search-files-search-function', '68dc14822daad0ffac3746a502234f486182ef6e', '2025-06-11 05:47:09.410959');
INSERT INTO storage.migrations VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2025-06-11 05:47:09.415134');
INSERT INTO storage.migrations VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2025-06-11 05:47:09.418142');
INSERT INTO storage.migrations VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2025-06-11 05:47:09.420028');
INSERT INTO storage.migrations VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2025-06-11 05:47:09.421973');
INSERT INTO storage.migrations VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2025-06-11 05:47:09.436958');
INSERT INTO storage.migrations VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2025-06-11 05:47:09.439282');
INSERT INTO storage.migrations VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2025-06-11 05:47:09.444391');
INSERT INTO storage.migrations VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2025-06-11 05:47:09.447491');
INSERT INTO storage.migrations VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2025-06-11 05:47:09.450313');
INSERT INTO storage.migrations VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2025-06-11 05:47:09.452272');
INSERT INTO storage.migrations VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2025-06-11 05:47:09.456677');
INSERT INTO storage.migrations VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2025-06-11 05:47:09.470502');
INSERT INTO storage.migrations VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2025-06-11 05:47:09.482661');
INSERT INTO storage.migrations VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2025-06-11 05:47:09.485127');
INSERT INTO storage.migrations VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2025-06-11 05:47:09.487286');
INSERT INTO storage.migrations VALUES (26, 'objects-prefixes', 'ef3f7871121cdc47a65308e6702519e853422ae2', '2025-06-11 05:47:09.489039');
INSERT INTO storage.migrations VALUES (27, 'search-v2', '33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2', '2025-06-11 05:47:09.501575');
INSERT INTO storage.migrations VALUES (28, 'object-bucket-name-sorting', 'ba85ec41b62c6a30a3f136788227ee47f311c436', '2025-06-11 05:47:09.508115');
INSERT INTO storage.migrations VALUES (29, 'create-prefixes', 'a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b', '2025-06-11 05:47:09.511124');
INSERT INTO storage.migrations VALUES (30, 'update-object-levels', '6c6f6cc9430d570f26284a24cf7b210599032db7', '2025-06-11 05:47:09.514465');
INSERT INTO storage.migrations VALUES (31, 'objects-level-index', '33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8', '2025-06-11 05:47:09.519147');
INSERT INTO storage.migrations VALUES (32, 'backward-compatible-index-on-objects', '2d51eeb437a96868b36fcdfb1ddefdf13bef1647', '2025-06-11 05:47:09.524075');
INSERT INTO storage.migrations VALUES (33, 'backward-compatible-index-on-prefixes', 'fe473390e1b8c407434c0e470655945b110507bf', '2025-06-11 05:47:09.530396');
INSERT INTO storage.migrations VALUES (34, 'optimize-search-function-v1', '82b0e469a00e8ebce495e29bfa70a0797f7ebd2c', '2025-06-11 05:47:09.531348');
INSERT INTO storage.migrations VALUES (35, 'add-insert-trigger-prefixes', '63bb9fd05deb3dc5e9fa66c83e82b152f0caf589', '2025-06-11 05:47:09.535543');
INSERT INTO storage.migrations VALUES (36, 'optimise-existing-functions', '81cf92eb0c36612865a18016a38496c530443899', '2025-06-11 05:47:09.537508');
INSERT INTO storage.migrations VALUES (37, 'add-bucket-name-length-trigger', '3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1', '2025-06-11 05:47:09.543074');


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

INSERT INTO supabase_functions.migrations VALUES ('initial', '2025-06-11 05:45:55.898725+00');
INSERT INTO supabase_functions.migrations VALUES ('20210809183423_update_grants', '2025-06-11 05:45:55.898725+00');


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

INSERT INTO supabase_migrations.schema_migrations VALUES ('20250127000000', '{"/*
  # Add updated_at trigger function
  
  This migration adds the update_updated_at_column function that is used
  by triggers to automatically update updated_at timestamps.
*/

-- Create the function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql"}', 'add_updated_at_function');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250128000000', '{"/*
  # Multi-Level Affiliate System (MLM) with Go High Level Integration
  
  This migration creates the new affiliate system that will replace GoAffPro
  and supports 3-level commission structure with GHL as primary signup source.
  
  1. Core Tables:
    - `affiliate_system_users` - Master affiliate table (consolidates all sources)
    - `referral_relationships` - Tracks who referred whom (multi-level tree)
    - `commission_plans` - Product commission rates for each level
    - `multi_level_commissions` - Calculated commissions for L1, L2, L3
    - `ghl_affiliates` - Go High Level import data
    - `payouts` - Payout management
    - `team_statistics` - Pre-calculated team stats for performance
  
  2. Features:
    - Multi-source data consolidation (GHL, MightyNetworks, Shopify, GoAffPro)
    - 3-level commission structure with custom rates per product
    - Referral tracking with codes and manual assignment
    - Team management and statistics
    - Admin oversight capabilities
    - Performance optimization with materialized views
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"","-- Commission Plans table - Define commission rates for each product and level
CREATE TABLE IF NOT EXISTS commission_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_category TEXT NOT NULL, -- ''coaching_program'', ''affiliate_software'', ''mastermind'', etc.
  product_name TEXT NOT NULL,
  shopify_product_id TEXT,
  level_1_rate DECIMAL(5,2) NOT NULL, -- e.g., 20.00 for 20%
  level_2_rate DECIMAL(5,2) NOT NULL, -- e.g., 5.00 for 5%
  level_3_rate DECIMAL(5,2) NOT NULL, -- e.g., 2.00 for 2%
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT now(),
  effective_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Master Affiliate Users table - Consolidates all affiliate sources
CREATE TABLE IF NOT EXISTS affiliate_system_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE,
  
  -- Source tracking
  primary_source TEXT NOT NULL CHECK (primary_source IN (''ghl'', ''mightynetworks'', ''shopify'', ''goaffpro'', ''manual'')),
  ghl_contact_id TEXT,
  mighty_member_id TEXT,
  goaffpro_affiliate_id TEXT,
  shopify_customer_id TEXT,
  
  -- Status and metrics
  status TEXT DEFAULT ''active'' CHECK (status IN (''active'', ''inactive'', ''suspended'', ''pending'')),
  signup_date TIMESTAMPTZ,
  last_active TIMESTAMPTZ,
  
  -- Team metrics (cached for performance)
  total_l1_affiliates INTEGER DEFAULT 0,
  total_l2_affiliates INTEGER DEFAULT 0,
  total_l3_affiliates INTEGER DEFAULT 0,
  total_team_size INTEGER DEFAULT 0,
  
  -- Commission totals (cached for performance)
  total_l1_earnings DECIMAL(10,2) DEFAULT 0,
  total_l2_earnings DECIMAL(10,2) DEFAULT 0,
  total_l3_earnings DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  paid_earnings DECIMAL(10,2) DEFAULT 0,
  
  -- Additional fields
  payout_email TEXT,
  payment_method TEXT,
  notes TEXT,
  custom_fields JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Referral Relationships table - Tracks the multi-level referral tree
CREATE TABLE IF NOT EXISTS referral_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- The person being referred
  affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id) ON DELETE CASCADE,
  
  -- Their direct referrer (Level 1)
  l1_referrer_id UUID REFERENCES affiliate_system_users(id) ON DELETE SET NULL,
  
  -- Their indirect referrer (Level 2) - referrer''s referrer
  l2_referrer_id UUID REFERENCES affiliate_system_users(id) ON DELETE SET NULL,
  
  -- Their grand referrer (Level 3) - referrer''s referrer''s referrer
  l3_referrer_id UUID REFERENCES affiliate_system_users(id) ON DELETE SET NULL,
  
  -- Tracking
  referral_method TEXT CHECK (referral_method IN (''referral_code'', ''manual_assignment'', ''import'')),
  referral_code_used TEXT,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_date TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicate relationships
  UNIQUE(affiliate_id),
  
  -- Prevent self-referrals at any level
  CHECK (affiliate_id != l1_referrer_id),
  CHECK (affiliate_id != l2_referrer_id),
  CHECK (affiliate_id != l3_referrer_id),
  CHECK (l1_referrer_id != l2_referrer_id OR l1_referrer_id IS NULL OR l2_referrer_id IS NULL),
  CHECK (l1_referrer_id != l3_referrer_id OR l1_referrer_id IS NULL OR l3_referrer_id IS NULL),
  CHECK (l2_referrer_id != l3_referrer_id OR l2_referrer_id IS NULL OR l3_referrer_id IS NULL),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Multi-Level Commissions table - Tracks all commission calculations
CREATE TABLE IF NOT EXISTS multi_level_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Order information
  order_source TEXT NOT NULL CHECK (order_source IN (''shopify'', ''mightynetworks'', ''goaffpro'', ''manual'')),
  order_id TEXT NOT NULL, -- External order ID
  internal_order_id UUID, -- Reference to our order tables if applicable
  
  -- Customer details
  customer_email TEXT,
  customer_name TEXT,
  order_total DECIMAL(10,2) NOT NULL,
  order_date TIMESTAMPTZ NOT NULL,
  
  -- Product information
  product_category TEXT,
  product_name TEXT,
  product_id TEXT,
  
  -- Commission details
  purchasing_affiliate_id UUID REFERENCES affiliate_system_users(id), -- Who made the sale
  commission_level INTEGER NOT NULL CHECK (commission_level IN (1, 2, 3)),
  earning_affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id), -- Who earns the commission
  
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  
  -- Status tracking
  status TEXT DEFAULT ''pending'' CHECK (status IN (''pending'', ''approved'', ''paid'', ''cancelled'', ''disputed'')),
  approved_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  payout_id UUID, -- Reference to payouts table
  
  -- Admin fields
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  
  -- Prevent duplicate commissions
  UNIQUE(order_source, order_id, commission_level, earning_affiliate_id),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Go High Level Affiliates table - Import data from GHL
CREATE TABLE IF NOT EXISTS ghl_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_contact_id TEXT UNIQUE NOT NULL,
  
  -- Contact information
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- GHL specific fields
  contact_source TEXT,
  tags JSONB,
  custom_fields JSONB,
  date_added TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  
  -- Referral information
  referred_by_contact_id TEXT,
  referral_code TEXT,
  
  -- Status
  status TEXT,
  
  -- Sync tracking
  last_synced TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT ''synced'' CHECK (sync_status IN (''synced'', ''error'', ''pending'')),
  raw_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Team Statistics table - Pre-calculated team metrics for performance
CREATE TABLE IF NOT EXISTS team_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id) ON DELETE CASCADE,
  
  -- Team size metrics
  l1_direct_count INTEGER DEFAULT 0,
  l2_indirect_count INTEGER DEFAULT 0,
  l3_total_count INTEGER DEFAULT 0,
  total_team_size INTEGER DEFAULT 0,
  
  -- Sales metrics for their team
  l1_sales_volume DECIMAL(12,2) DEFAULT 0,
  l2_sales_volume DECIMAL(12,2) DEFAULT 0,
  l3_sales_volume DECIMAL(12,2) DEFAULT 0,
  total_team_volume DECIMAL(12,2) DEFAULT 0,
  
  -- Commission metrics
  l1_commissions_earned DECIMAL(10,2) DEFAULT 0,
  l2_commissions_earned DECIMAL(10,2) DEFAULT 0,
  l3_commissions_earned DECIMAL(10,2) DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  
  -- Time period for these stats
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  calculation_date TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicate periods per affiliate
  UNIQUE(affiliate_id, period_start, period_end),
  
  created_at TIMESTAMPTZ DEFAULT now()
)","-- Payouts table - Manage commission payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id),
  
  -- Payout details
  amount DECIMAL(10,2) NOT NULL,
  commission_ids UUID[] NOT NULL, -- Array of commission IDs included
  
  -- Payment information
  payment_method TEXT CHECK (payment_method IN (''paypal'', ''stripe'', ''bank_transfer'', ''wise'', ''manual'')),
  payment_email TEXT,
  payment_details JSONB,
  
  -- Status tracking
  status TEXT DEFAULT ''pending'' CHECK (status IN (''pending'', ''processing'', ''completed'', ''failed'', ''cancelled'')),
  requested_date TIMESTAMPTZ DEFAULT now(),
  processed_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  
  -- External tracking
  transaction_id TEXT,
  payment_gateway_response JSONB,
  
  -- Admin fields
  processed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Import Logs table - Track all import operations
CREATE TABLE IF NOT EXISTS affiliate_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_source TEXT NOT NULL CHECK (import_source IN (''ghl'', ''mightynetworks'', ''shopify'', ''goaffpro'', ''manual'')),
  import_type TEXT NOT NULL CHECK (import_type IN (''affiliates'', ''orders'', ''full_sync'')),
  
  -- Status tracking
  status TEXT NOT NULL CHECK (status IN (''started'', ''completed'', ''failed'', ''partial'')),
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Metrics
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  
  -- Error tracking
  error_details JSONB,
  warnings JSONB,
  
  -- Configuration used for import
  import_config JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
)","-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_email ON affiliate_system_users(email)","CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_referral_code ON affiliate_system_users(referral_code)","CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_primary_source ON affiliate_system_users(primary_source)","CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_ghl_contact_id ON affiliate_system_users(ghl_contact_id)","CREATE INDEX IF NOT EXISTS idx_referral_relationships_affiliate_id ON referral_relationships(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_referral_relationships_l1_referrer ON referral_relationships(l1_referrer_id)","CREATE INDEX IF NOT EXISTS idx_referral_relationships_l2_referrer ON referral_relationships(l2_referrer_id)","CREATE INDEX IF NOT EXISTS idx_referral_relationships_l3_referrer ON referral_relationships(l3_referrer_id)","CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_earning_affiliate ON multi_level_commissions(earning_affiliate_id)","CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_order_date ON multi_level_commissions(order_date)","CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_status ON multi_level_commissions(status)","CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_order_source_id ON multi_level_commissions(order_source, order_id)","CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_contact_id ON ghl_affiliates(ghl_contact_id)","CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_email ON ghl_affiliates(email)","CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_referred_by ON ghl_affiliates(referred_by_contact_id)","CREATE INDEX IF NOT EXISTS idx_team_statistics_affiliate_id ON team_statistics(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_team_statistics_period ON team_statistics(period_start, period_end)","CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON payouts(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status)","-- Enable Row Level Security
ALTER TABLE commission_plans ENABLE ROW LEVEL SECURITY","ALTER TABLE affiliate_system_users ENABLE ROW LEVEL SECURITY","ALTER TABLE referral_relationships ENABLE ROW LEVEL SECURITY","ALTER TABLE multi_level_commissions ENABLE ROW LEVEL SECURITY","ALTER TABLE ghl_affiliates ENABLE ROW LEVEL SECURITY","ALTER TABLE team_statistics ENABLE ROW LEVEL SECURITY","ALTER TABLE payouts ENABLE ROW LEVEL SECURITY","ALTER TABLE affiliate_import_logs ENABLE ROW LEVEL SECURITY","-- Create RLS Policies

-- Commission Plans - Admin only for modifications, read for authenticated users
CREATE POLICY \"Admins can manage commission plans\"
  ON commission_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","CREATE POLICY \"Authenticated users can read commission plans\"
  ON commission_plans
  FOR SELECT
  TO authenticated
  USING (true)","-- Affiliate System Users - Users can see their own data and their team
CREATE POLICY \"Users can view their own affiliate data\"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )","CREATE POLICY \"Users can view their team members\"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT affiliate_id FROM referral_relationships 
      WHERE l1_referrer_id IN (
        SELECT id FROM affiliate_system_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
      OR l2_referrer_id IN (
        SELECT id FROM affiliate_system_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
      OR l3_referrer_id IN (
        SELECT id FROM affiliate_system_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  )","CREATE POLICY \"Admins can manage all affiliate users\"
  ON affiliate_system_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","-- Referral Relationships - Users can see their own relationships and team
CREATE POLICY \"Users can view their referral relationships\"
  ON referral_relationships
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR l1_referrer_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR l2_referrer_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR l3_referrer_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )","CREATE POLICY \"Admins can manage referral relationships\"
  ON referral_relationships
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","-- Multi-Level Commissions - Users can see commissions they earned
CREATE POLICY \"Users can view their commissions\"
  ON multi_level_commissions
  FOR SELECT
  TO authenticated
  USING (
    earning_affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )","CREATE POLICY \"Admins can manage all commissions\"
  ON multi_level_commissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","-- Similar policies for other tables...
CREATE POLICY \"Admins can manage GHL affiliates\"
  ON ghl_affiliates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","CREATE POLICY \"Users can view their team statistics\"
  ON team_statistics
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )","CREATE POLICY \"Admins can manage team statistics\"
  ON team_statistics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","CREATE POLICY \"Users can view their payouts\"
  ON payouts
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )","CREATE POLICY \"Admins can manage payouts\"
  ON payouts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","CREATE POLICY \"Admins can view import logs\"
  ON affiliate_import_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>''is_admin'')::boolean = true
    )
  )","-- Add updated_at triggers
CREATE TRIGGER set_commission_plans_updated_at
  BEFORE UPDATE ON commission_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_affiliate_system_users_updated_at
  BEFORE UPDATE ON affiliate_system_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_referral_relationships_updated_at
  BEFORE UPDATE ON referral_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_multi_level_commissions_updated_at
  BEFORE UPDATE ON multi_level_commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_ghl_affiliates_updated_at
  BEFORE UPDATE ON ghl_affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_payouts_updated_at
  BEFORE UPDATE ON payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()"}', 'multi_level_affiliate_system');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250128000001', '{"/*
  # Seed Commission Plans
  
  This migration populates the commission_plans table with the exact commission
  structure from the provided image/requirements.
  
  Products and Commission Rates (Updated to match Jennaz''s requirements):
  - Bae: L1=20%, L2=10%, L3=5%
  - Coaching Packs: L1=20%, L2=10%, L3=5%
  - Online Mastery: L1=20%, L2=10%, L3=5%
  - BRAVO Fitness: L1=20%, L2=10%, L3=5%
  - AI System: L1=20%, L2=10%, L3=5%
  - REACTION CBD: L1=15%, L2=5%, L3=5%
  - EVENTS: L1=5%, L2=2.5%, L3=2.5%
*/

-- Clear existing commission plans first
DELETE FROM commission_plans","-- Insert commission plans based on Jennaz''s exact commission structure
INSERT INTO commission_plans (
  product_category,
  product_name,
  level_1_rate,
  level_2_rate,
  level_3_rate,
  is_active,
  notes
) VALUES 
  (
    ''bae'',
    ''Bae'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''Bae product commission structure''
  ),
  (
    ''coaching_packs'',
    ''Coaching Packs'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''Coaching Packs commission structure''
  ),
  (
    ''online_mastery'',
    ''Online Mastery'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''Online Mastery program commission structure''
  ),
  (
    ''bravo_fitness'',
    ''BRAVO Fitness'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''BRAVO Fitness commission structure''
  ),
  (
    ''ai_system'',
    ''AI System'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''AI System commission structure''
  ),
  (
    ''reaction_cbd'',
    ''REACTION CBD'',
    15.00, -- Level 1: 15%
    5.00,  -- Level 2: 5%
    5.00,  -- Level 3: 5%
    true,
    ''REACTION CBD product commission structure''
  ),
  (
    ''events'',
    ''EVENTS'',
    5.00,  -- Level 1: 5%
    2.50,  -- Level 2: 2.5%
    2.50,  -- Level 3: 2.5%
    true,
    ''Events commission structure''
  ),
  (
    ''default'',
    ''Default Product'',
    15.00, -- Level 1: 15%
    5.00,  -- Level 2: 5%
    2.00,  -- Level 3: 2%
    true,
    ''Default commission structure for uncategorized products''
  )","-- Create a function to automatically calculate commissions for new orders
CREATE OR REPLACE FUNCTION calculate_multi_level_commissions(
  p_order_source TEXT,
  p_order_id TEXT,
  p_customer_email TEXT,
  p_customer_name TEXT,
  p_order_total DECIMAL(10,2),
  p_order_date TIMESTAMPTZ,
  p_product_category TEXT DEFAULT ''default'',
  p_product_name TEXT DEFAULT ''Product'',
  p_product_id TEXT DEFAULT NULL,
  p_purchasing_affiliate_email TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  affiliate_record RECORD;
  referral_record RECORD;
  commission_plan RECORD;
  l1_commission DECIMAL(10,2);
  l2_commission DECIMAL(10,2);
  l3_commission DECIMAL(10,2);
  commissions_created JSONB := ''[]''::JSONB;
  commission_id UUID;
BEGIN
  -- Get the commission plan for this product
  SELECT * INTO commission_plan
  FROM commission_plans
  WHERE product_category = p_product_category
    AND is_active = true
    AND (effective_until IS NULL OR effective_until > p_order_date)
  ORDER BY effective_from DESC
  LIMIT 1;
  
  -- If no specific plan found, use default
  IF commission_plan IS NULL THEN
    SELECT * INTO commission_plan
    FROM commission_plans
    WHERE product_category = ''default''
      AND is_active = true
    LIMIT 1;
  END IF;
  
  -- If still no plan found, exit
  IF commission_plan IS NULL THEN
    RETURN ''{\"error\": \"No commission plan found\"}''::JSONB;
  END IF;
  
  -- Find the purchasing affiliate (if provided)
  IF p_purchasing_affiliate_email IS NOT NULL THEN
    SELECT * INTO affiliate_record
    FROM affiliate_system_users
    WHERE email = p_purchasing_affiliate_email
      AND status = ''active'';
    
    -- If affiliate found, get their referral relationships
    IF affiliate_record IS NOT NULL THEN
      SELECT * INTO referral_record
      FROM referral_relationships
      WHERE affiliate_id = affiliate_record.id;
      
      -- Calculate commission amounts
      l1_commission := p_order_total * (commission_plan.level_1_rate / 100);
      l2_commission := p_order_total * (commission_plan.level_2_rate / 100);
      l3_commission := p_order_total * (commission_plan.level_3_rate / 100);
      
      -- Create Level 1 Commission (direct referrer)
      IF referral_record.l1_referrer_id IS NOT NULL THEN
        INSERT INTO multi_level_commissions (
          order_source, order_id, customer_email, customer_name,
          order_total, order_date, product_category, product_name, product_id,
          purchasing_affiliate_id, commission_level, earning_affiliate_id,
          commission_rate, commission_amount, status
        ) VALUES (
          p_order_source, p_order_id, p_customer_email, p_customer_name,
          p_order_total, p_order_date, p_product_category, p_product_name, p_product_id,
          affiliate_record.id, 1, referral_record.l1_referrer_id,
          commission_plan.level_1_rate, l1_commission, ''pending''
        ) RETURNING id INTO commission_id;
        
        commissions_created := commissions_created || jsonb_build_object(
          ''level'', 1,
          ''commission_id'', commission_id,
          ''earning_affiliate_id'', referral_record.l1_referrer_id,
          ''amount'', l1_commission
        );
      END IF;
      
      -- Create Level 2 Commission (indirect referrer)
      IF referral_record.l2_referrer_id IS NOT NULL THEN
        INSERT INTO multi_level_commissions (
          order_source, order_id, customer_email, customer_name,
          order_total, order_date, product_category, product_name, product_id,
          purchasing_affiliate_id, commission_level, earning_affiliate_id,
          commission_rate, commission_amount, status
        ) VALUES (
          p_order_source, p_order_id, p_customer_email, p_customer_name,
          p_order_total, p_order_date, p_product_category, p_product_name, p_product_id,
          affiliate_record.id, 2, referral_record.l2_referrer_id,
          commission_plan.level_2_rate, l2_commission, ''pending''
        ) RETURNING id INTO commission_id;
        
        commissions_created := commissions_created || jsonb_build_object(
          ''level'', 2,
          ''commission_id'', commission_id,
          ''earning_affiliate_id'', referral_record.l2_referrer_id,
          ''amount'', l2_commission
        );
      END IF;
      
      -- Create Level 3 Commission (grand referrer)
      IF referral_record.l3_referrer_id IS NOT NULL THEN
        INSERT INTO multi_level_commissions (
          order_source, order_id, customer_email, customer_name,
          order_total, order_date, product_category, product_name, product_id,
          purchasing_affiliate_id, commission_level, earning_affiliate_id,
          commission_rate, commission_amount, status
        ) VALUES (
          p_order_source, p_order_id, p_customer_email, p_customer_name,
          p_order_total, p_order_date, p_product_category, p_product_name, p_product_id,
          affiliate_record.id, 3, referral_record.l3_referrer_id,
          commission_plan.level_3_rate, l3_commission, ''pending''
        ) RETURNING id INTO commission_id;
        
        commissions_created := commissions_created || jsonb_build_object(
          ''level'', 3,
          ''commission_id'', commission_id,
          ''earning_affiliate_id'', referral_record.l3_referrer_id,
          ''amount'', l3_commission
        );
      END IF;
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    ''success'', true,
    ''commissions_created'', commissions_created,
    ''commission_plan_used'', row_to_json(commission_plan)
  );
END;
$$ LANGUAGE plpgsql","-- Create a function to update team statistics
CREATE OR REPLACE FUNCTION update_team_statistics(p_affiliate_id UUID) RETURNS VOID AS $$
DECLARE
  stats_record RECORD;
BEGIN
  -- Calculate team statistics for the given affiliate
  WITH team_stats AS (
    SELECT 
      COUNT(CASE WHEN rr.l1_referrer_id = p_affiliate_id THEN 1 END) as l1_count,
      COUNT(CASE WHEN rr.l2_referrer_id = p_affiliate_id THEN 1 END) as l2_count,
      COUNT(CASE WHEN rr.l3_referrer_id = p_affiliate_id THEN 1 END) as l3_count,
      COUNT(*) as total_team
    FROM referral_relationships rr
    WHERE rr.l1_referrer_id = p_affiliate_id 
       OR rr.l2_referrer_id = p_affiliate_id 
       OR rr.l3_referrer_id = p_affiliate_id
  ),
  commission_stats AS (
    SELECT 
      COALESCE(SUM(CASE WHEN commission_level = 1 THEN commission_amount END), 0) as l1_earnings,
      COALESCE(SUM(CASE WHEN commission_level = 2 THEN commission_amount END), 0) as l2_earnings,
      COALESCE(SUM(CASE WHEN commission_level = 3 THEN commission_amount END), 0) as l3_earnings,
      COALESCE(SUM(commission_amount), 0) as total_earnings
    FROM multi_level_commissions
    WHERE earning_affiliate_id = p_affiliate_id
      AND status IN (''pending'', ''approved'', ''paid'')
  )
  SELECT 
    ts.l1_count, ts.l2_count, ts.l3_count, ts.total_team,
    cs.l1_earnings, cs.l2_earnings, cs.l3_earnings, cs.total_earnings
  INTO stats_record
  FROM team_stats ts, commission_stats cs;
  
  -- Update the affiliate''s cached statistics
  UPDATE affiliate_system_users
  SET 
    total_l1_affiliates = stats_record.l1_count,
    total_l2_affiliates = stats_record.l2_count,
    total_l3_affiliates = stats_record.l3_count,
    total_team_size = stats_record.total_team,
    total_l1_earnings = stats_record.l1_earnings,
    total_l2_earnings = stats_record.l2_earnings,
    total_l3_earnings = stats_record.l3_earnings,
    total_earnings = stats_record.total_earnings,
    updated_at = now()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql","-- Create trigger to update team statistics when referral relationships change
CREATE OR REPLACE FUNCTION trigger_update_team_statistics() RETURNS TRIGGER AS $$
BEGIN
  -- Update statistics for all affected referrers
  IF TG_OP = ''INSERT'' OR TG_OP = ''UPDATE'' THEN
    IF NEW.l1_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(NEW.l1_referrer_id);
    END IF;
    IF NEW.l2_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(NEW.l2_referrer_id);
    END IF;
    IF NEW.l3_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(NEW.l3_referrer_id);
    END IF;
  END IF;
  
  IF TG_OP = ''DELETE'' OR TG_OP = ''UPDATE'' THEN
    IF OLD.l1_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(OLD.l1_referrer_id);
    END IF;
    IF OLD.l2_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(OLD.l2_referrer_id);
    END IF;
    IF OLD.l3_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(OLD.l3_referrer_id);
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql","CREATE TRIGGER trigger_referral_relationships_team_stats
  AFTER INSERT OR UPDATE OR DELETE ON referral_relationships
  FOR EACH ROW EXECUTE FUNCTION trigger_update_team_statistics()","-- Create trigger to update team statistics when commissions change
CREATE OR REPLACE FUNCTION trigger_commission_team_statistics() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = ''INSERT'' OR TG_OP = ''UPDATE'' THEN
    PERFORM update_team_statistics(NEW.earning_affiliate_id);
  END IF;
  
  IF TG_OP = ''DELETE'' OR TG_OP = ''UPDATE'' THEN
    PERFORM update_team_statistics(OLD.earning_affiliate_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql","CREATE TRIGGER trigger_commissions_team_stats
  AFTER INSERT OR UPDATE OR DELETE ON multi_level_commissions
  FOR EACH ROW EXECUTE FUNCTION trigger_commission_team_statistics()"}', 'seed_commission_plans');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250131000000', '{"-- Migration for JennaZ (Go High Level) Affiliate Integration
-- This migration creates tables to store affiliate data from Go High Level (GHL)
-- Tables created:
-- - `jennaz_affiliates` - Store affiliate data from JennaZ/GHL
-- - `jennaz_orders` - Store order data from JennaZ/GHL  
-- - `jennaz_rewards` - Store reward data from JennaZ/GHL
-- - `jennaz_payments` - Store payment data from JennaZ/GHL
-- - `jennaz_commissions` - Store commission data from JennaZ/GHL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"","-- Create updated_at trigger function if it doesn''t exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language ''plpgsql''","-- =============================================
-- JennaZ Affiliates Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_id TEXT NOT NULL UNIQUE, -- GHL contact/affiliate ID
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  status TEXT DEFAULT ''pending'', -- pending, active, inactive, suspended
  referral_code TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage rate
  balance DECIMAL(12,2) DEFAULT 0.00,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  signup_date TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  payout_method TEXT, -- paypal, bank_transfer, etc.
  payout_email TEXT,
  notes TEXT,
  tags TEXT[], -- array of tags from GHL
  custom_fields JSONB, -- flexible storage for GHL custom fields
  raw_data JSONB, -- store the full API response
  data_source TEXT NOT NULL DEFAULT ''jennaz'', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)","-- =============================================
-- JennaZ Orders Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_order_id TEXT NOT NULL UNIQUE, -- GHL order/opportunity ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  contact_id TEXT, -- GHL contact ID for the customer
  opportunity_id TEXT, -- GHL opportunity ID
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  order_value DECIMAL(12,2) DEFAULT 0.00,
  order_total DECIMAL(12,2) DEFAULT 0.00,
  commission_amount DECIMAL(12,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  commission_status TEXT DEFAULT ''pending'', -- pending, approved, paid
  order_status TEXT, -- open, won, lost, abandoned
  pipeline_id TEXT, -- GHL pipeline ID
  stage_id TEXT, -- GHL stage ID
  order_date TIMESTAMP WITH TIME ZONE,
  close_date TIMESTAMP WITH TIME ZONE,
  products JSONB, -- array of products/services
  notes TEXT,
  raw_data JSONB, -- store the full GHL opportunity data
  data_source TEXT NOT NULL DEFAULT ''jennaz'', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)","-- =============================================
-- JennaZ Rewards Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_reward_id TEXT NOT NULL UNIQUE, -- GHL reward/bonus ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  reward_type TEXT, -- bonus, milestone, referral_bonus, etc.
  description TEXT,
  reward_amount DECIMAL(12,2) DEFAULT 0.00,
  reward_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT ''pending'', -- pending, approved, paid
  trigger_event TEXT, -- what triggered this reward
  notes TEXT,
  raw_data JSONB, -- store any additional GHL data
  data_source TEXT NOT NULL DEFAULT ''jennaz'', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)","-- =============================================
-- JennaZ Payments Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_payment_id TEXT NOT NULL UNIQUE, -- GHL payment/payout ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  payment_amount DECIMAL(12,2) DEFAULT 0.00,
  payment_method TEXT, -- paypal, bank_transfer, check, etc.
  payment_status TEXT DEFAULT ''pending'', -- pending, processing, completed, failed
  payment_date TIMESTAMP WITH TIME ZONE,
  transaction_id TEXT, -- external payment processor transaction ID
  payment_reference TEXT, -- internal reference number
  currency TEXT DEFAULT ''USD'',
  exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
  fees DECIMAL(12,2) DEFAULT 0.00,
  net_amount DECIMAL(12,2) DEFAULT 0.00,
  notes TEXT,
  raw_data JSONB, -- store additional payment data
  data_source TEXT NOT NULL DEFAULT ''jennaz'', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)","-- =============================================
-- JennaZ Commissions Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_commission_id TEXT NOT NULL UNIQUE, -- GHL commission ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  jennaz_order_id TEXT, -- Reference to GHL order ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  order_id UUID REFERENCES jennaz_orders(id), -- Foreign key to our orders table
  commission_type TEXT, -- sale, referral, bonus, override
  commission_amount DECIMAL(12,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  commission_level INTEGER DEFAULT 1, -- for multi-level commissions
  commission_status TEXT DEFAULT ''pending'', -- pending, approved, paid
  commission_date TIMESTAMP WITH TIME ZONE,
  payment_date TIMESTAMP WITH TIME ZONE,
  base_amount DECIMAL(12,2) DEFAULT 0.00, -- amount the commission is calculated on
  currency TEXT DEFAULT ''USD'',
  notes TEXT,
  raw_data JSONB, -- store additional commission data
  data_source TEXT NOT NULL DEFAULT ''jennaz'', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)","-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_jennaz_id ON jennaz_affiliates(jennaz_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_email ON jennaz_affiliates(email)","CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_data_source ON jennaz_affiliates(data_source)","CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_status ON jennaz_affiliates(status)","CREATE INDEX IF NOT EXISTS idx_jennaz_orders_jennaz_id ON jennaz_orders(jennaz_order_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_orders_affiliate_id ON jennaz_orders(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_orders_data_source ON jennaz_orders(data_source)","CREATE INDEX IF NOT EXISTS idx_jennaz_orders_status ON jennaz_orders(order_status)","CREATE INDEX IF NOT EXISTS idx_jennaz_rewards_affiliate_id ON jennaz_rewards(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_rewards_data_source ON jennaz_rewards(data_source)","CREATE INDEX IF NOT EXISTS idx_jennaz_payments_affiliate_id ON jennaz_payments(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_payments_data_source ON jennaz_payments(data_source)","CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_affiliate_id ON jennaz_commissions(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_order_id ON jennaz_commissions(order_id)","CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_data_source ON jennaz_commissions(data_source)","-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE jennaz_affiliates ENABLE ROW LEVEL SECURITY","ALTER TABLE jennaz_orders ENABLE ROW LEVEL SECURITY","ALTER TABLE jennaz_rewards ENABLE ROW LEVEL SECURITY","ALTER TABLE jennaz_payments ENABLE ROW LEVEL SECURITY","ALTER TABLE jennaz_commissions ENABLE ROW LEVEL SECURITY","-- RLS Policies for Authenticated Users
CREATE POLICY \"Allow authenticated users to read jennaz_affiliates\"
ON jennaz_affiliates
FOR SELECT
TO authenticated
USING (true)","CREATE POLICY \"Allow authenticated users to read jennaz_orders\"
ON jennaz_orders
FOR SELECT
TO authenticated
USING (true)","CREATE POLICY \"Allow authenticated users to read jennaz_rewards\"
ON jennaz_rewards
FOR SELECT
TO authenticated
USING (true)","CREATE POLICY \"Allow authenticated users to read jennaz_payments\"
ON jennaz_payments
FOR SELECT
TO authenticated
USING (true)","CREATE POLICY \"Allow authenticated users to read jennaz_commissions\"
ON jennaz_commissions
FOR SELECT
TO authenticated
USING (true)","-- RLS Policies for Service Role (for imports and admin operations)
CREATE POLICY \"Allow service role full access to jennaz_affiliates\"
ON jennaz_affiliates
FOR ALL
TO service_role
USING (true)","CREATE POLICY \"Allow service role full access to jennaz_orders\"
ON jennaz_orders
FOR ALL
TO service_role
USING (true)","CREATE POLICY \"Allow service role full access to jennaz_rewards\"
ON jennaz_rewards
FOR ALL
TO service_role
USING (true)","CREATE POLICY \"Allow service role full access to jennaz_payments\"
ON jennaz_payments
FOR ALL
TO service_role
USING (true)","CREATE POLICY \"Allow service role full access to jennaz_commissions\"
ON jennaz_commissions
FOR ALL
TO service_role
USING (true)","-- =============================================
-- Triggers for Updated At
-- =============================================
CREATE TRIGGER set_jennaz_affiliates_updated_at
BEFORE UPDATE ON jennaz_affiliates
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column()","CREATE TRIGGER set_jennaz_orders_updated_at
BEFORE UPDATE ON jennaz_orders
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column()","CREATE TRIGGER set_jennaz_rewards_updated_at
BEFORE UPDATE ON jennaz_rewards
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column()","CREATE TRIGGER set_jennaz_payments_updated_at
BEFORE UPDATE ON jennaz_payments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column()","CREATE TRIGGER set_jennaz_commissions_updated_at
BEFORE UPDATE ON jennaz_commissions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column()","-- =============================================
-- Comments for Documentation
-- =============================================
COMMENT ON TABLE jennaz_affiliates IS ''Stores affiliate data from JennaZ (Go High Level) platform''","COMMENT ON TABLE jennaz_orders IS ''Stores order/opportunity data from JennaZ (Go High Level) platform''","COMMENT ON TABLE jennaz_rewards IS ''Stores reward/bonus data from JennaZ (Go High Level) platform''","COMMENT ON TABLE jennaz_payments IS ''Stores payment/payout data from JennaZ (Go High Level) platform''","COMMENT ON TABLE jennaz_commissions IS ''Stores commission data from JennaZ (Go High Level) platform''","-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================
-- Uncomment the following to insert sample data

/*
INSERT INTO jennaz_affiliates (jennaz_id, email, first_name, last_name, status, referral_code, commission_rate, data_source) VALUES
(''ghl_001'', ''test@jennaz.co'', ''Test'', ''Affiliate'', ''active'', ''JENNAZ001'', 10.00, ''test''),
(''ghl_002'', ''demo@jennaz.co'', ''Demo'', ''Partner'', ''active'', ''JENNAZ002'', 15.00, ''test'');

INSERT INTO jennaz_orders (jennaz_order_id, jennaz_affiliate_id, customer_name, customer_email, order_value, commission_amount, order_status, data_source) VALUES
(''ord_001'', ''ghl_001'', ''John Doe'', ''john@example.com'', 100.00, 10.00, ''won'', ''test''),
(''ord_002'', ''ghl_002'', ''Jane Smith'', ''jane@example.com'', 200.00, 30.00, ''won'', ''test'');
*/"}', 'jennaz_ghl_integration');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250131000100', '{"/*
  # Update Commission Plans for Jennaz''s Products
  
  This migration updates the commission_plans table with the exact commission
  structure from Jennaz''s requirements table.
  
  Products and Commission Rates:
  - Bae: L1=20%, L2=10%, L3=5%
  - Coaching Packs: L1=20%, L2=10%, L3=5%
  - Online Mastery: L1=20%, L2=10%, L3=5%
  - BRAVO Fitness: L1=20%, L2=10%, L3=5%
  - AI System: L1=20%, L2=10%, L3=5%
  - REACTION CBD: L1=15%, L2=5%, L3=5%
  - EVENTS: L1=5%, L2=2.5%, L3=2.5%
*/

-- Clear existing commission plans
DELETE FROM commission_plans","-- Insert Jennaz''s exact commission plans
INSERT INTO commission_plans (
  product_category,
  product_name,
  level_1_rate,
  level_2_rate,
  level_3_rate,
  is_active,
  notes
) VALUES 
  (
    ''bae'',
    ''Bae'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''Bae product commission structure''
  ),
  (
    ''coaching_packs'',
    ''Coaching Packs'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''Coaching Packs commission structure''
  ),
  (
    ''online_mastery'',
    ''Online Mastery'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''Online Mastery program commission structure''
  ),
  (
    ''bravo_fitness'',
    ''BRAVO Fitness'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''BRAVO Fitness commission structure''
  ),
  (
    ''ai_system'',
    ''AI System'',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    ''AI System commission structure''
  ),
  (
    ''reaction_cbd'',
    ''REACTION CBD'',
    15.00, -- Level 1: 15%
    5.00,  -- Level 2: 5%
    5.00,  -- Level 3: 5%
    true,
    ''REACTION CBD product commission structure''
  ),
  (
    ''events'',
    ''EVENTS'',
    5.00,  -- Level 1: 5%
    2.50,  -- Level 2: 2.5%
    2.50,  -- Level 3: 2.5%
    true,
    ''Events commission structure''
  ),
  (
    ''default'',
    ''Default Product'',
    15.00, -- Level 1: 15%
    5.00,  -- Level 2: 5%
    2.00,  -- Level 3: 2%
    true,
    ''Default commission structure for uncategorized products''
  )","-- Update the commission calculation function to handle the new product categories
CREATE OR REPLACE FUNCTION get_commission_plan_for_product(
  p_product_name TEXT DEFAULT NULL,
  p_product_category TEXT DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  product_category TEXT,
  product_name TEXT,
  level_1_rate DECIMAL(5,2),
  level_2_rate DECIMAL(5,2),
  level_3_rate DECIMAL(5,2)
) AS $$
BEGIN
  -- First try to match by exact product name
  IF p_product_name IS NOT NULL THEN
    RETURN QUERY
    SELECT cp.id, cp.product_category, cp.product_name, cp.level_1_rate, cp.level_2_rate, cp.level_3_rate
    FROM commission_plans cp
    WHERE LOWER(cp.product_name) = LOWER(p_product_name)
      AND cp.is_active = true
      AND (cp.effective_until IS NULL OR cp.effective_until > now())
    ORDER BY cp.effective_from DESC
    LIMIT 1;
    
    IF FOUND THEN
      RETURN;
    END IF;
  END IF;
  
  -- Then try to match by product category
  IF p_product_category IS NOT NULL THEN
    RETURN QUERY
    SELECT cp.id, cp.product_category, cp.product_name, cp.level_1_rate, cp.level_2_rate, cp.level_3_rate
    FROM commission_plans cp
    WHERE cp.product_category = p_product_category
      AND cp.is_active = true
      AND (cp.effective_until IS NULL OR cp.effective_until > now())
    ORDER BY cp.effective_from DESC
    LIMIT 1;
    
    IF FOUND THEN
      RETURN;
    END IF;
  END IF;
  
  -- Finally, fall back to default
  RETURN QUERY
  SELECT cp.id, cp.product_category, cp.product_name, cp.level_1_rate, cp.level_2_rate, cp.level_3_rate
  FROM commission_plans cp
  WHERE cp.product_category = ''default''
    AND cp.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql","-- Add a comment explaining the commission structure
COMMENT ON TABLE commission_plans IS ''Jennaz Multi-Level Commission Plans: Bae, Coaching Packs, Online Mastery, BRAVO Fitness, AI System (20%/10%/5%), REACTION CBD (15%/5%/5%), EVENTS (5%/2.5%/2.5%)''"}', 'update_commission_plans_jennaz');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523124034', '{"/*
  # Create initial schema for the affiliate dashboard

  1. New Tables
    - `users` - Store user information
    - `affiliates` - Track affiliate relationships
    - `transactions` - Store transaction data
    - `commissions` - Calculate and store commissions
    - `clicks` - Track link clicks for analytics
  2. Security
    - Enable RLS on all tables
    - Add policies for secure data access
*/

-- Create schema for custom tables
CREATE SCHEMA IF NOT EXISTS public","-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  referral_code TEXT UNIQUE,
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Affiliates table - tracks the relationship between users and their referrers
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  affiliate_id UUID NOT NULL REFERENCES users(id),
  level INT NOT NULL, -- 1 for direct, 2 for second level, etc.
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00, -- percentage
  status TEXT NOT NULL DEFAULT ''pending'' CHECK (status IN (''pending'', ''active'', ''inactive'')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referrer_id, affiliate_id)
)","-- Transactions table - stores sales transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref TEXT UNIQUE NOT NULL,
  affiliate_id UUID REFERENCES users(id),
  customer_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_id TEXT,
  status TEXT NOT NULL DEFAULT ''completed'' CHECK (status IN (''pending'', ''completed'', ''refunded'')),
  created_at TIMESTAMPTZ DEFAULT now()
)","-- Commissions table - calculated commissions for each transaction
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  affiliate_id UUID NOT NULL REFERENCES users(id),
  referrer_id UUID NOT NULL REFERENCES users(id),
  level INT NOT NULL, -- 1 for direct, 2 for second level, etc.
  amount DECIMAL(10,2) NOT NULL,
  rate_applied DECIMAL(5,2) NOT NULL, -- percentage that was applied
  status TEXT NOT NULL DEFAULT ''pending'' CHECK (status IN (''pending'', ''paid'', ''cancelled'')),
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Clicks table - track clicks on affiliate links
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES users(id),
  referral_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  conversion_status TEXT DEFAULT ''clicked'' CHECK (conversion_status IN (''clicked'', ''converted'')),
  created_at TIMESTAMPTZ DEFAULT now()
)","-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY","ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY","ALTER TABLE transactions ENABLE ROW LEVEL SECURITY","ALTER TABLE commissions ENABLE ROW LEVEL SECURITY","ALTER TABLE clicks ENABLE ROW LEVEL SECURITY","-- RLS Policies for users table
CREATE POLICY \"Users can read their own data\"
  ON users
  FOR SELECT
  USING (auth.uid() = id)","CREATE POLICY \"Referrers can view their affiliates'' basic info\"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE referrer_id = auth.uid() 
      AND affiliate_id = users.id
    )
  )","CREATE POLICY \"Users can update their own data\"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)","-- RLS Policies for affiliates table
CREATE POLICY \"Users can view their affiliate relationships\"
  ON affiliates
  FOR SELECT
  USING (
    referrer_id = auth.uid() OR affiliate_id = auth.uid()
  )","CREATE POLICY \"Users can create their own affiliates\"
  ON affiliates
  FOR INSERT
  WITH CHECK (referrer_id = auth.uid())","-- RLS Policies for transactions table
CREATE POLICY \"Users can see transactions where they are the affiliate\"
  ON transactions
  FOR SELECT
  USING (affiliate_id = auth.uid())","CREATE POLICY \"Referrers can see transactions from their affiliates\"
  ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE referrer_id = auth.uid() 
      AND affiliate_id = transactions.affiliate_id
    )
  )","-- RLS Policies for commissions table
CREATE POLICY \"Users can see their own commissions\"
  ON commissions
  FOR SELECT
  USING (affiliate_id = auth.uid() OR referrer_id = auth.uid())","-- RLS Policies for clicks table
CREATE POLICY \"Users can see clicks on their own referral code\"
  ON clicks
  FOR SELECT
  USING (affiliate_id = auth.uid())","CREATE POLICY \"Referrers can see clicks from their affiliates\"
  ON clicks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE referrer_id = auth.uid() 
      AND affiliate_id = clicks.affiliate_id
    )
  )","-- Create functions to handle automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql","-- Set up triggers for updated_at timestamps
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_affiliates_updated_at
BEFORE UPDATE ON affiliates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_commissions_updated_at
BEFORE UPDATE ON commissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column()"}', 'frosty_bush');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523172350', '{"/*
  # Add insert policy for users table

  1. Security Changes
    - Add policy to allow users to insert their own data
*/

CREATE POLICY \"Users can insert their own data\"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id)"}', 'shrill_temple');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523174026', '{"/*
  # Add Shopify integration tables

  1. New Tables
    - `shopify_orders` - Store Shopify order information
    - `shopify_order_items` - Store individual items in each order
    - `shopify_products` - Store product information
    - `shopify_webhooks` - Track webhook events from Shopify
  
  2. Changes
    - Add Shopify-specific fields to transactions table
    - Add indexes for performance
  
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Shopify products table
CREATE TABLE IF NOT EXISTS shopify_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_product_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  handle TEXT,
  vendor TEXT,
  product_type TEXT,
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  sku TEXT,
  inventory_quantity INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Shopify orders table
CREATE TABLE IF NOT EXISTS shopify_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id TEXT NOT NULL UNIQUE,
  order_number TEXT NOT NULL,
  email TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  subtotal_price DECIMAL(10,2),
  total_tax DECIMAL(10,2),
  currency TEXT,
  financial_status TEXT,
  fulfillment_status TEXT,
  customer_id TEXT,
  first_name TEXT,
  last_name TEXT,
  affiliate_id UUID REFERENCES users(id),
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Shopify order items table
CREATE TABLE IF NOT EXISTS shopify_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES shopify_orders(id),
  shopify_product_id TEXT NOT NULL,
  variant_id TEXT,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)","-- Shopify webhooks table
CREATE TABLE IF NOT EXISTS shopify_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  shop_domain TEXT NOT NULL,
  webhook_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
)","-- Add indexes
CREATE INDEX idx_shopify_orders_affiliate_id ON shopify_orders(affiliate_id)","CREATE INDEX idx_shopify_orders_created_at ON shopify_orders(created_at)","CREATE INDEX idx_shopify_order_items_order_id ON shopify_order_items(order_id)","CREATE INDEX idx_shopify_products_shopify_id ON shopify_products(shopify_product_id)","-- Enable RLS
ALTER TABLE shopify_products ENABLE ROW LEVEL SECURITY","ALTER TABLE shopify_orders ENABLE ROW LEVEL SECURITY","ALTER TABLE shopify_order_items ENABLE ROW LEVEL SECURITY","ALTER TABLE shopify_webhooks ENABLE ROW LEVEL SECURITY","-- RLS Policies
CREATE POLICY \"Admins can manage Shopify products\"
  ON shopify_products
  FOR ALL
  TO authenticated
  USING (true)","CREATE POLICY \"Users can view their attributed orders\"
  ON shopify_orders
  FOR SELECT
  TO authenticated
  USING (affiliate_id = auth.uid())","CREATE POLICY \"Users can view their order items\"
  ON shopify_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shopify_orders
      WHERE shopify_orders.id = order_id
      AND shopify_orders.affiliate_id = auth.uid()
    )
  )","-- Add triggers for updated_at
CREATE TRIGGER set_shopify_products_updated_at
  BEFORE UPDATE ON shopify_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_shopify_orders_updated_at
  BEFORE UPDATE ON shopify_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()"}', 'blue_coral');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523180546', '{"/*
  # Clear sample data from tables
  
  This migration removes all sample data while preserving the table structure and policies.
*/

-- Clear existing data
TRUNCATE TABLE commissions CASCADE","TRUNCATE TABLE transactions CASCADE","TRUNCATE TABLE clicks CASCADE","TRUNCATE TABLE affiliates CASCADE","TRUNCATE TABLE users CASCADE","-- Reset sequences
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS affiliates_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS transactions_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS commissions_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS clicks_id_seq RESTART WITH 1"}', 'graceful_fire');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523180842', '{"/*
  # Clear sample data from all tables
  
  This migration removes all sample data from the database before importing real data from GOAFFPRO
*/

-- Clear existing data
TRUNCATE TABLE commissions CASCADE","TRUNCATE TABLE transactions CASCADE","TRUNCATE TABLE clicks CASCADE","TRUNCATE TABLE affiliates CASCADE","TRUNCATE TABLE users CASCADE","-- Reset sequences
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS affiliates_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS transactions_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS commissions_id_seq RESTART WITH 1","ALTER SEQUENCE IF EXISTS clicks_id_seq RESTART WITH 1"}', 'crimson_beacon');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523191600', '{"/*
  # Add admin role and first user privileges

  1. Changes
    - Add admin column to users table
    - Update RLS policies to grant admin privileges
    - Add function to automatically set first user as admin
    - Add trigger to handle admin assignment

  2. Security
    - Enable RLS policies for admin access
    - Maintain existing user policies
    - Add admin-specific policies
*/

-- Add admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false","-- Create function to check if this is the first user
CREATE OR REPLACE FUNCTION public.check_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE is_admin = true
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER","-- Create trigger to automatically set first user as admin
DROP TRIGGER IF EXISTS set_first_user_as_admin ON users","CREATE TRIGGER set_first_user_as_admin
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_first_user()","-- Update RLS policies for users table
CREATE POLICY \"Admins can view all users\"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin = true)","CREATE POLICY \"Admins can update all users\"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin = true)
  WITH CHECK (is_admin = true)","-- Update RLS policies for other tables to grant admin access
CREATE POLICY \"Admins can view all affiliates\"
  ON affiliates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ))","CREATE POLICY \"Admins can view all transactions\"
  ON transactions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ))","CREATE POLICY \"Admins can view all commissions\"
  ON commissions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ))","CREATE POLICY \"Admins can view all clicks\"
  ON clicks
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ))"}', 'patient_base');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523193353', '{"/*
  # Fix user recursion and RLS policies

  1. Changes
    - Drop existing RLS policies that may cause recursion
    - Create new, optimized policies
    - Update admin check function
*/

-- Drop existing policies to rebuild them
DROP POLICY IF EXISTS \"Users can read their own data\" ON users","DROP POLICY IF EXISTS \"Referrers can view their affiliates'' basic info\" ON users","DROP POLICY IF EXISTS \"Users can update their own data\" ON users","DROP POLICY IF EXISTS \"Users can insert their own data\" ON users","DROP POLICY IF EXISTS \"Admins can view all users\" ON users","DROP POLICY IF EXISTS \"Admins can update all users\" ON users","-- Create optimized policies
CREATE POLICY \"Enable read access for authenticated users\"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users AS admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  )","CREATE POLICY \"Enable insert for authenticated users\"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id)","CREATE POLICY \"Enable update for users and admins\"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users AS admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  )
  WITH CHECK (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users AS admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  )","-- Update the first user check function to avoid recursion
CREATE OR REPLACE FUNCTION public.check_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER"}', 'steep_spire');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523194721', '{"/*
  # Fix user policies and recursion

  1. Changes
    - Drop all existing policies
    - Create new policies with unique names
    - Update admin check function
*/

-- Drop all existing policies
DROP POLICY IF EXISTS \"Users can read their own data\" ON users","DROP POLICY IF EXISTS \"Referrers can view their affiliates'' basic info\" ON users","DROP POLICY IF EXISTS \"Users can update their own data\" ON users","DROP POLICY IF EXISTS \"Users can insert their own data\" ON users","DROP POLICY IF EXISTS \"Admins can view all users\" ON users","DROP POLICY IF EXISTS \"Admins can update all users\" ON users","DROP POLICY IF EXISTS \"Enable read access for authenticated users\" ON users","DROP POLICY IF EXISTS \"Enable insert for authenticated users\" ON users","DROP POLICY IF EXISTS \"Enable update for users and admins\" ON users","-- Create new policies with unique names
CREATE POLICY \"users_select_policy\"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  )","CREATE POLICY \"users_insert_policy\"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id)","CREATE POLICY \"users_update_policy\"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  )
  WITH CHECK (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  )","-- Update the first user check function to avoid recursion
CREATE OR REPLACE FUNCTION public.check_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER"}', 'curly_breeze');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523194940', '{"/*
  # Fix user policies and recursion issues

  1. Changes
    - Drop all existing policies
    - Create new simplified policies with correct auth.uid() function
    - Update first user function
*/

-- Drop all existing policies
DROP POLICY IF EXISTS \"Users can read their own data\" ON users","DROP POLICY IF EXISTS \"Referrers can view their affiliates'' basic info\" ON users","DROP POLICY IF EXISTS \"Users can update their own data\" ON users","DROP POLICY IF EXISTS \"Users can insert their own data\" ON users","DROP POLICY IF EXISTS \"Admins can view all users\" ON users","DROP POLICY IF EXISTS \"Admins can update all users\" ON users","DROP POLICY IF EXISTS \"Enable read access for authenticated users\" ON users","DROP POLICY IF EXISTS \"Enable insert for authenticated users\" ON users","DROP POLICY IF EXISTS \"Enable update for users and admins\" ON users","DROP POLICY IF EXISTS \"users_select_policy\" ON users","DROP POLICY IF EXISTS \"users_insert_policy\" ON users","DROP POLICY IF EXISTS \"users_update_policy\" ON users","-- Create simplified policies
CREATE POLICY \"users_select_policy\"
  ON users FOR SELECT
  TO authenticated
  USING ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users admin_user
  WHERE ((admin_user.id = auth.uid()) AND (admin_user.is_admin = true)))))","CREATE POLICY \"users_insert_policy\"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id)","CREATE POLICY \"users_update_policy\"
  ON users FOR UPDATE
  TO authenticated
  USING ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users admin_user
  WHERE ((admin_user.id = auth.uid()) AND (admin_user.is_admin = true)))))
  WITH CHECK ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users admin_user
  WHERE ((admin_user.id = auth.uid()) AND (admin_user.is_admin = true)))))","-- Update first user function
CREATE OR REPLACE FUNCTION check_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE is_admin = true
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER"}', 'hidden_wave');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250523195330', '{"/*
  # Fix users table policies recursion

  1. Changes
    - Drop existing policies
    - Create new policies without recursion
    - Simplify admin checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS \"users_select_policy\" ON users","DROP POLICY IF EXISTS \"users_insert_policy\" ON users","DROP POLICY IF EXISTS \"users_update_policy\" ON users","-- Create new policies without recursion
CREATE POLICY \"users_select_policy\"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    is_admin = true
  )","CREATE POLICY \"users_insert_policy\"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
  )","CREATE POLICY \"users_update_policy\"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    is_admin = true
  )
  WITH CHECK (
    id = auth.uid() OR
    is_admin = true
  )","-- Update first user function to be simpler
CREATE OR REPLACE FUNCTION check_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE is_admin = true
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER"}', 'dusty_term');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250524172050', '{"/*
  # Fix RLS policies to prevent recursion

  1. Changes
    - Drop existing policies that may cause recursion
    - Create new simplified policies
    - Fix admin access checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS \"users_select_policy\" ON users","DROP POLICY IF EXISTS \"users_insert_policy\" ON users","DROP POLICY IF EXISTS \"users_update_policy\" ON users","-- Create new simplified policies without recursion
CREATE POLICY \"users_select_policy\" ON users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","CREATE POLICY \"users_insert_policy\" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id)","CREATE POLICY \"users_update_policy\" ON users
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )
  WITH CHECK (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","-- Update admin check function
CREATE OR REPLACE FUNCTION check_first_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  IF user_count = 0 THEN
    -- Set admin status in auth.users metadata
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, ''{}''::jsonb) || 
      jsonb_build_object(''is_admin'', ''true'')
    WHERE id = NEW.id;
    
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER"}', 'mute_meadow');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250526000000', '{"/*
  # GoAffPro Integration Tables

  1. New Tables
    - `goaffpro_affiliates` - Store affiliate data from GoAffPro
    - `goaffpro_orders` - Store order data from GoAffPro
    - `goaffpro_rewards` - Store reward data from GoAffPro
    - `goaffpro_payments` - Store payment data from GoAffPro
    - `goaffpro_commissions` - Store commission data from GoAffPro
    - `data_import_logs` - Track import operations
  
  2. Changes
    - Add data_source field to existing tables to flag test vs real data
    - Add indexes for performance
  
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Add data_source column to existing tables (only if they exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''users'') THEN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''affiliates'') THEN
    ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''transactions'') THEN
    ALTER TABLE transactions ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''commissions'') THEN
    ALTER TABLE commissions ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''clicks'') THEN
    ALTER TABLE clicks ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''shopify_orders'') THEN
    ALTER TABLE shopify_orders ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = ''shopify_products'') THEN
    ALTER TABLE shopify_products ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT ''test'' CHECK (data_source IN (''test'', ''goaffpro''));
  END IF;
END $$","-- GoAffPro Affiliates table
CREATE TABLE IF NOT EXISTS goaffpro_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  status TEXT,
  signup_date TIMESTAMPTZ,
  referral_code TEXT,
  commission_rate DECIMAL(5,2),
  balance DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  tags JSONB,
  custom_fields JSONB,
  raw_data JSONB,
  data_source TEXT DEFAULT ''goaffpro'' CHECK (data_source IN (''test'', ''goaffpro'')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- GoAffPro Orders table
CREATE TABLE IF NOT EXISTS goaffpro_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_order_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  order_number TEXT,
  customer_email TEXT,
  customer_name TEXT,
  order_total DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  status TEXT,
  order_date TIMESTAMPTZ,
  commission_status TEXT,
  products JSONB,
  raw_data JSONB,
  data_source TEXT DEFAULT ''goaffpro'' CHECK (data_source IN (''test'', ''goaffpro'')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- GoAffPro Rewards table
CREATE TABLE IF NOT EXISTS goaffpro_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_reward_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  reward_type TEXT,
  amount DECIMAL(10,2),
  description TEXT,
  status TEXT,
  date_awarded TIMESTAMPTZ,
  raw_data JSONB,
  data_source TEXT DEFAULT ''goaffpro'' CHECK (data_source IN (''test'', ''goaffpro'')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- GoAffPro Payments table
CREATE TABLE IF NOT EXISTS goaffpro_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_payment_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  amount DECIMAL(10,2),
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  status TEXT,
  transaction_id TEXT,
  notes TEXT,
  raw_data JSONB,
  data_source TEXT DEFAULT ''goaffpro'' CHECK (data_source IN (''test'', ''goaffpro'')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- GoAffPro Commissions table
CREATE TABLE IF NOT EXISTS goaffpro_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_commission_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  goaffpro_order_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  order_id UUID REFERENCES goaffpro_orders(id),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  status TEXT,
  date_earned TIMESTAMPTZ,
  date_paid TIMESTAMPTZ,
  raw_data JSONB,
  data_source TEXT DEFAULT ''goaffpro'' CHECK (data_source IN (''test'', ''goaffpro'')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)","-- Data Import Logs table
CREATE TABLE IF NOT EXISTS data_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_type TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (''started'', ''completed'', ''failed'')),
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  started_by UUID REFERENCES auth.users(id)
)","-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_goaffpro_id ON goaffpro_affiliates(goaffpro_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_email ON goaffpro_affiliates(email)","CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_data_source ON goaffpro_affiliates(data_source)","CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_goaffpro_id ON goaffpro_orders(goaffpro_order_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_affiliate_id ON goaffpro_orders(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_data_source ON goaffpro_orders(data_source)","CREATE INDEX IF NOT EXISTS idx_goaffpro_rewards_affiliate_id ON goaffpro_rewards(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_rewards_data_source ON goaffpro_rewards(data_source)","CREATE INDEX IF NOT EXISTS idx_goaffpro_payments_affiliate_id ON goaffpro_payments(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_payments_data_source ON goaffpro_payments(data_source)","CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_affiliate_id ON goaffpro_commissions(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_order_id ON goaffpro_commissions(order_id)","CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_data_source ON goaffpro_commissions(data_source)","CREATE INDEX IF NOT EXISTS idx_data_import_logs_import_type ON data_import_logs(import_type)","CREATE INDEX IF NOT EXISTS idx_data_import_logs_status ON data_import_logs(status)","-- Enable RLS
ALTER TABLE goaffpro_affiliates ENABLE ROW LEVEL SECURITY","ALTER TABLE goaffpro_orders ENABLE ROW LEVEL SECURITY","ALTER TABLE goaffpro_rewards ENABLE ROW LEVEL SECURITY","ALTER TABLE goaffpro_payments ENABLE ROW LEVEL SECURITY","ALTER TABLE goaffpro_commissions ENABLE ROW LEVEL SECURITY","ALTER TABLE data_import_logs ENABLE ROW LEVEL SECURITY","-- RLS Policies for GoAffPro tables (admin access for now)
CREATE POLICY \"Admins can manage GoAffPro affiliates\"
  ON goaffpro_affiliates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","CREATE POLICY \"Admins can manage GoAffPro orders\"
  ON goaffpro_orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","CREATE POLICY \"Admins can manage GoAffPro rewards\"
  ON goaffpro_rewards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","CREATE POLICY \"Admins can manage GoAffPro payments\"
  ON goaffpro_payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","CREATE POLICY \"Admins can manage GoAffPro commissions\"
  ON goaffpro_commissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","CREATE POLICY \"Admins can manage import logs\"
  ON data_import_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>''is_admin'' = ''true''
    )
  )","-- Allow all authenticated users to read GoAffPro data for now
CREATE POLICY \"Authenticated users can read GoAffPro affiliates\"
  ON goaffpro_affiliates
  FOR SELECT
  TO authenticated
  USING (true)","CREATE POLICY \"Authenticated users can read GoAffPro orders\"
  ON goaffpro_orders
  FOR SELECT
  TO authenticated
  USING (true)","CREATE POLICY \"Authenticated users can read GoAffPro rewards\"
  ON goaffpro_rewards
  FOR SELECT
  TO authenticated
  USING (true)","CREATE POLICY \"Authenticated users can read GoAffPro payments\"
  ON goaffpro_payments
  FOR SELECT
  TO authenticated
  USING (true)","CREATE POLICY \"Authenticated users can read import logs\"
  ON data_import_logs
  FOR SELECT
  TO authenticated
  USING (true)","-- Add triggers for updated_at
CREATE TRIGGER set_goaffpro_affiliates_updated_at
  BEFORE UPDATE ON goaffpro_affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_goaffpro_orders_updated_at
  BEFORE UPDATE ON goaffpro_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_goaffpro_rewards_updated_at
  BEFORE UPDATE ON goaffpro_rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_goaffpro_payments_updated_at
  BEFORE UPDATE ON goaffpro_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER set_goaffpro_commissions_updated_at
  BEFORE UPDATE ON goaffpro_commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()"}', 'goaffpro_integration');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20250527000000', '{"-- MightyNetworks/Rewardful Integration Tables
-- This migration creates tables to store data from MightyNetworks via Rewardful API

-- MightyNetworks Affiliates Table
CREATE TABLE IF NOT EXISTS mightynetworks_affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_affiliate_id TEXT UNIQUE NOT NULL,
  mighty_member_id TEXT,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  phone TEXT,
  status TEXT,
  signup_date TIMESTAMPTZ,
  referral_code TEXT,
  commission_rate DECIMAL(5,4),
  balance DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  payout_email TEXT,
  payment_method TEXT,
  tags JSONB,
  custom_fields JSONB,
  raw_data JSONB,
  data_source TEXT DEFAULT ''mightynetworks'',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)","-- MightyNetworks Orders/Referrals Table
CREATE TABLE IF NOT EXISTS mightynetworks_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_referral_id TEXT UNIQUE NOT NULL,
  rewardful_affiliate_id TEXT,
  affiliate_id UUID REFERENCES mightynetworks_affiliates(id),
  customer_email TEXT,
  customer_name TEXT,
  order_total DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,4),
  status TEXT,
  referral_date TIMESTAMPTZ,
  conversion_date TIMESTAMPTZ,
  commission_status TEXT,
  stripe_charge_id TEXT,
  stripe_customer_id TEXT,
  mighty_plan_name TEXT,
  mighty_space_name TEXT,
  raw_data JSONB,
  data_source TEXT DEFAULT ''mightynetworks'',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)","-- MightyNetworks Commissions Table
CREATE TABLE IF NOT EXISTS mightynetworks_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_commission_id TEXT UNIQUE NOT NULL,
  rewardful_affiliate_id TEXT,
  rewardful_referral_id TEXT,
  affiliate_id UUID REFERENCES mightynetworks_affiliates(id),
  referral_id UUID REFERENCES mightynetworks_referrals(id),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,4),
  commission_type TEXT, -- ''percentage'', ''fixed'', ''recurring''
  status TEXT, -- ''pending'', ''approved'', ''paid'', ''cancelled''
  date_earned TIMESTAMPTZ,
  date_approved TIMESTAMPTZ,
  date_paid TIMESTAMPTZ,
  payout_id TEXT,
  raw_data JSONB,
  data_source TEXT DEFAULT ''mightynetworks'',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)","-- MightyNetworks Payouts Table
CREATE TABLE IF NOT EXISTS mightynetworks_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_payout_id TEXT UNIQUE NOT NULL,
  rewardful_affiliate_id TEXT,
  affiliate_id UUID REFERENCES mightynetworks_affiliates(id),
  amount DECIMAL(10,2),
  payment_method TEXT, -- ''paypal'', ''stripe'', ''wise'', ''manual''
  payment_date TIMESTAMPTZ,
  status TEXT, -- ''pending'', ''processing'', ''completed'', ''failed''
  transaction_id TEXT,
  payment_email TEXT,
  notes TEXT,
  commission_ids TEXT[], -- Array of commission IDs included in this payout
  raw_data JSONB,
  data_source TEXT DEFAULT ''mightynetworks'',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)","-- MightyNetworks Import Logs Table
CREATE TABLE IF NOT EXISTS mightynetworks_import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  import_type TEXT NOT NULL, -- ''affiliates'', ''referrals'', ''commissions'', ''payouts'', ''all''
  source TEXT DEFAULT ''mightynetworks'',
  status TEXT NOT NULL, -- ''started'', ''completed'', ''failed''
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)","-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_email ON mightynetworks_affiliates(email)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_rewardful_id ON mightynetworks_affiliates(rewardful_affiliate_id)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_status ON mightynetworks_affiliates(status)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_data_source ON mightynetworks_affiliates(data_source)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_affiliate_id ON mightynetworks_referrals(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_rewardful_id ON mightynetworks_referrals(rewardful_referral_id)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_status ON mightynetworks_referrals(status)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_date ON mightynetworks_referrals(referral_date)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_affiliate_id ON mightynetworks_commissions(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_status ON mightynetworks_commissions(status)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_date_earned ON mightynetworks_commissions(date_earned)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_affiliate_id ON mightynetworks_payouts(affiliate_id)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_status ON mightynetworks_payouts(status)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_date ON mightynetworks_payouts(payment_date)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_type ON mightynetworks_import_logs(import_type)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_status ON mightynetworks_import_logs(status)","CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_started_at ON mightynetworks_import_logs(started_at)","-- Add updated_at trigger for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language ''plpgsql''","CREATE TRIGGER update_mightynetworks_affiliates_updated_at 
    BEFORE UPDATE ON mightynetworks_affiliates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_mightynetworks_referrals_updated_at 
    BEFORE UPDATE ON mightynetworks_referrals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_mightynetworks_commissions_updated_at 
    BEFORE UPDATE ON mightynetworks_commissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_mightynetworks_payouts_updated_at 
    BEFORE UPDATE ON mightynetworks_payouts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","-- Enable Row Level Security (RLS)
ALTER TABLE mightynetworks_affiliates ENABLE ROW LEVEL SECURITY","ALTER TABLE mightynetworks_referrals ENABLE ROW LEVEL SECURITY","ALTER TABLE mightynetworks_commissions ENABLE ROW LEVEL SECURITY","ALTER TABLE mightynetworks_payouts ENABLE ROW LEVEL SECURITY","ALTER TABLE mightynetworks_import_logs ENABLE ROW LEVEL SECURITY","-- Create RLS policies (allow all for authenticated users for now)
CREATE POLICY \"Allow all operations for authenticated users\" ON mightynetworks_affiliates
    FOR ALL USING (auth.role() = ''authenticated'')","CREATE POLICY \"Allow all operations for authenticated users\" ON mightynetworks_referrals
    FOR ALL USING (auth.role() = ''authenticated'')","CREATE POLICY \"Allow all operations for authenticated users\" ON mightynetworks_commissions
    FOR ALL USING (auth.role() = ''authenticated'')","CREATE POLICY \"Allow all operations for authenticated users\" ON mightynetworks_payouts
    FOR ALL USING (auth.role() = ''authenticated'')","CREATE POLICY \"Allow all operations for authenticated users\" ON mightynetworks_import_logs
    FOR ALL USING (auth.role() = ''authenticated'')","-- Grant permissions to service role
GRANT ALL ON mightynetworks_affiliates TO service_role","GRANT ALL ON mightynetworks_referrals TO service_role","GRANT ALL ON mightynetworks_commissions TO service_role","GRANT ALL ON mightynetworks_payouts TO service_role","GRANT ALL ON mightynetworks_import_logs TO service_role","-- Add comments for documentation
COMMENT ON TABLE mightynetworks_affiliates IS ''Stores affiliate data from MightyNetworks via Rewardful API''","COMMENT ON TABLE mightynetworks_referrals IS ''Stores referral/order data from MightyNetworks via Rewardful API''","COMMENT ON TABLE mightynetworks_commissions IS ''Stores commission data from MightyNetworks via Rewardful API''","COMMENT ON TABLE mightynetworks_payouts IS ''Stores payout data from MightyNetworks via Rewardful API''","COMMENT ON TABLE mightynetworks_import_logs IS ''Tracks import operations for MightyNetworks data''"}', 'mightynetworks_integration');


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

INSERT INTO supabase_migrations.seed_files VALUES ('supabase/seed.sql', '959e631b6aae0cc5c86ac805ef6dc524c53f0026c6df1587ae37c1f2d6e04b37');


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 28, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

