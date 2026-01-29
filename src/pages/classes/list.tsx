import React from 'react'
import {ListView} from "@/components/refine-ui/views/list-view"
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import {Search} from "lucide-react"
import {Input} from "@/components/ui/input.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import {useMemo, useState} from 'react';
import { CreateButton } from '@/components/refine-ui/buttons/create'
import {DataTable} from "@/components/refine-ui/data-table/data-table"
import { useTable } from '@refinedev/react-table'
import {ClassDetails, Subject, User} from "@/types"
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx"
import { useList } from '@refinedev/core'

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [selectedTeacher, setSelectedTeacher] = useState('all')

    // Fetch subjects for filter dropdown
    const { query: subjectsQuery } = useList<Subject>({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        },
    });
    const subjects = subjectsQuery.data?.data || [];

    // Fetch teachers for filter dropdown
    const { query: teachersQuery } = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher",
            },
        ],
        pagination: {
            pageSize: 100,
        },
    });
    const teachers = teachersQuery.data?.data || [];

    const subjectFilters = selectedSubject === 'all' ? []: [
        {field: 'subject', operator: 'eq' as const, value: selectedSubject},
    ];
    const teacherFilters = selectedTeacher === 'all' ? []: [
        {field: 'teacher', operator: 'eq' as const, value: selectedTeacher},
    ];
    const searchFilters = searchQuery ? [
        {field: 'name', operator: 'contains' as const, value: searchQuery}
    ]: [];

    const classesTable = useTable<ClassDetails>({
        columns: useMemo<ColumnDef<ClassDetails>[]>(() => [
            {
                id: 'bannerUrl',
                accessorKey: 'bannerUrl',
                size: 100,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({getValue}) => {
                    const bannerUrl = getValue<string | undefined>();
                    return bannerUrl ? (
                        <img 
                            src={bannerUrl} 
                            alt="Class banner" 
                            className="w-16 h-16 rounded object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No image
                        </div>
                    );
                }
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Class Name</p>,
                cell: ({getValue}) => <span className="text-foreground">{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 120,
                header: () => <p className="column-title">Status</p>,
                cell: ({getValue}) => {
                    const status = getValue<'active' | 'inactive'>();
                    return (
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                            {status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                    );
                }
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 150,
                header: () => <p className="column-title">Subject</p>,
                cell: ({row}) => {
                    const subject = row.original.subject;
                    return subject ? (
                        <span className="text-foreground">{subject.name}</span>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    );
                }
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 150,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({row}) => {
                    const teacher = row.original.teacher;
                    return teacher ? (
                        <span className="text-foreground">{teacher.name}</span>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    );
                }
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({getValue}) => <span className="text-foreground">{getValue<number>()}</span>
            }
        ], []),
        refineCoreProps:{
            resource: 'classes',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: [...subjectFilters, ...teacherFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    {field: 'id', order: 'desc'}
                ]
            }
        }
    });

    return (
    <ListView>
        <Breadcrumb/>
        <h1 className="page-title">Classes</h1>
        <div className="intro-row">
            <p>Quick access to essential metrics and management tools</p>
            <div className="actions-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input 
                        type="text"
                        placeholder="Search by name..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Subjects
                            </SelectItem>
                            {subjects.map((subject: Subject) => (
                                <SelectItem key={subject.id} value={subject.name}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by teacher" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Teachers
                            </SelectItem>
                            {teachers.map((teacher: User) => (
                                <SelectItem key={teacher.id} value={teacher.name}>
                                    {teacher.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                   <CreateButton resource="classes"></CreateButton>
                </div>
            </div>
        </div>
        <DataTable table={classesTable} />
    </ListView>
  )
}

export default ClassesList
